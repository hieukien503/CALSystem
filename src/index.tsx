import 'core-js/es/number/is-integer';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import KonvaCanvas from './components/KonvaRender';
// import ThreeDCanvas from './components/ThreeRender';
// import { Point, Circle  } from './types/geometry';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// let p: Point = {
//     x: 0,
//     y: 0,
//     z: 1,
//     props: {
//         line_size: 0,
//         color: '#000000',
//         fill: true,
//         radius: 0.05,
//         label: 'C',
//         visible: {
//             label: false,
//             shape: true,
//         },
//         labelXOffset: 0,
//         labelYOffset: 0.01,
//         labelZOffset: 0,
//         line_style: {
//             dash_size: 0,
//             gap_size: 0,
//             dot_size: 0,
//         },
//         id: 'C',
//         opacity: 1
//     },

//     shapes: new Set(),
// }

// let c: Circle = {
//     centerC: p,
//     radius: 2,
//     normal: {
//         startVector: {
//             x: 0,
//             y: 0,
//             z: 0,
//             props: {
//                 line_size: 0,
//                 color: '#000000',
//                 fill: true,
//                 radius: 0.25,
//                 label: '',
//                 visible: {
//                     label: false,
//                     shape: true,
//                 },
//                 labelXOffset: 0,
//                 labelYOffset: 0.25,
//                 labelZOffset: 0,
//                 line_style: {
//                     dash_size: 0,
//                     gap_size: 0,
//                     dot_size: 0,
//                 },
//                 id: 'C'
//             },
//             shapes: new Set(),
//         },
//         endVector: {
//             x: 1,
//             y: 0,
//             z: 1,
//             props: {
//                 line_size: 0.5,
//                 color: '#000000',
//                 fill: true,
//                 radius: 0.25,
//                 label: '',
//                 visible: {
//                     label: false,
//                     shape: true,
//                 },
//                 labelXOffset: 0,
//                 labelYOffset: 0.25,
//                 labelZOffset: 0,
//                 line_style: {
//                     dash_size: 0,
//                     gap_size: 0,
//                     dot_size: 0,
//                 },
//                 id: 'C'
//             },
//             shapes: new Set(),
//         },
//         props: {
//             line_size: 0.5,
//             color: '#000000',
//             fill: true,
//             radius: 0.25,
//             label: '',
//             visible: {
//                 label: false,
//                 shape: false,
//             },
//             labelXOffset: 0,
//             labelYOffset: 0.25,
//             labelZOffset: 0,
//             line_style: {
//                 dash_size: 0,
//                 gap_size: 0,
//                 dot_size: 0,
//             },
//             id: 'C'
//         }
//     },
//     props: {
//         line_size: 0.5,
//         color: '#000000',
//         fill: true,
//         radius: 3,
//         label: 'c',
//         visible: {
//             label: false,
//             shape: true,
//         },
//         labelXOffset: 0,
//         labelYOffset: 0.25,
//         labelZOffset: 0,
//         line_style: {
//             dash_size: 0,
//             gap_size: 0,
//             dot_size: 0,
//         },
//         id: 'c'
//     }
// }

// let shapes = [p, c];

root.render(
    <KonvaCanvas width={window.innerWidth} height={window.innerHeight} background_color='#ffffff' />
    // <ThreeDCanvas width={window.innerWidth} height={window.innerHeight} background_color='#ffffff' shapes={shapes} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
