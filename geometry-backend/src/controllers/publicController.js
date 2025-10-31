const Project = require("../models/Project");
const User = require("../models/User");

// Home.tsx (simple placeholder: latest projects)
exports.loadHome = async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 }).limit(5);
        res.json({
            message: "Welcome to Home",
            latestProjects: projects
        });
    } catch (err) {
        res.status(500).json({ error: "Error loading home", details: err.message });
    }
};


// Escape regex để chống lỗi hoặc injection khi người dùng gõ ký tự đặc biệt
function escapeRegex(text) {
    if (!text) return "";
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Unified search: users by name + projects by title
 * - If not authenticated: users (name) + public projects
 * - If authenticated: users (name) + (public OR ownedBy==userId OR collaborators include userId)
 *
 * Query params:
 *   q (required) - search term
 *   page (optional) - default 1
 *   perPage (optional) - default 20
 *
 * GET /api/search?q=...&page=1&perPage=20
 */
exports.searchAll = async (req, res) => {
    try {
        const q = (req.query.q || "").trim();
        if (!q) return res.status(400).json({ error: "Missing search query (q)" });

        const page = Math.max(1, parseInt(req.query.page || "1", 10));
        const perPage = Math.min(100, Math.max(5, parseInt(req.query.perPage || "20", 10)));

        const regex = new RegExp(escapeRegex(q), "i");

        // Users: search by name only, public endpoint
        const [users, projects] = await Promise.all([
            User.find({ name: { $regex: regex } })
                .select("userId name") // only safe fields
                .limit(50),
            // Projects query built below
            (async () => {
                const userId = req.user?.userId; // may be undefined
                const baseFilter = { title: { $regex: regex } };

                if (userId) {
                    // detect collaborators field type in Project schema
                    const collPath = Project.schema.path('collaborators'); // Mongoose schema path

                    let collaboratorsClause;
                    if (collPath && collPath.caster && collPath.caster.instance === 'String') {
                        // collaborators stored as array of strings: ["U0001","U0003"]
                        collaboratorsClause = { collaborators: userId };
                    } else {
                        // collaborators stored as subdocuments: [{ userId: "...", role: "..." }]
                        collaboratorsClause = { 'collaborators.userId': userId };
                    }
                    // auth: include public OR ownedBy OR collaborators
                    baseFilter.$or = [
                        { sharing: "public" },
                        { ownedBy: userId },
                        collaboratorsClause
                    ];
                } else {
                    // no auth: only public
                    baseFilter.sharing = "public";
                }

                const projectsQuery = Project.find(baseFilter)
                    .select("title description ownedBy sharing createdAt")
                    .skip((page - 1) * perPage)
                    .limit(perPage)
                    .sort({ createdAt: -1 });

                const results = await projectsQuery.exec();
                return results;
            })()
        ]);

        res.json({
            query: q,
            page,
            perPage,
            users: users || [],
            projects: projects || []
        });
    } catch (err) {
        console.error("searchAll error:", err);
        res.status(500).json({ error: "Search failed", details: err.message });
    }
};