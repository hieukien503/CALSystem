function buildDAG(objects) {
    const dag = new Map();

    objects.forEach(obj => {
        if (!dag.has(obj.id)) {
            dag.set(obj.id, { ...obj, dependencies: [] });
        }

        obj.dependsOn.forEach(dep => {
            if (!dag.has(dep)) {
                dag.set(dep, { id: dep, dependencies: [] }); // placeholder
            }
            dag.get(dep).dependencies.push(obj.id);
        });
    });

    return dag;
}

module.exports = buildDAG;
