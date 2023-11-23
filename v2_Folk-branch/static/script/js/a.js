document.addEventListener("DOMContentLoaded", function () {
    // Create a graph
    var graph = new LiteGraph.LGraph();

    // Add nodes to the graph (example nodes)
    var node1 = LiteGraph.createNode("basic/number");
    var node2 = LiteGraph.createNode("basic/number");
    var sumNode = LiteGraph.createNode("math/sum");

    node1.setProperty("value", 5);
    node2.setProperty("value", 10);

    // Connect nodes
    graph.add(node1);
    graph.add(node2);
    graph.add(sumNode);
    graph.connect(node1, 0, sumNode, 0);
    graph.connect(node2, 0, sumNode, 1);

    // Create a graph canvas and add it to the container
    var canvas = new LiteGraph.LGraphCanvas("#graph-container", graph);
    
    // Enable pan and zoom
    canvas.allow_searchbox = false;
    canvas.allow_dragnodes = true;
    canvas.allow_interaction = true;

    // Set initial zoom level
    canvas.setZoom(1.0);

    // Handle window resize
    window.addEventListener("resize", function () {
        canvas.resize();
    });
});