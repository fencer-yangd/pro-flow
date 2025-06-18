import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
import Dagre from '@dagrejs/dagre';
import { cx } from 'antd-style';
import { Position } from 'reactflow';
import { EDGE_DANGER, EDGE_SELECT, EDGE_SUB_DANGER, EDGE_SUB_SELECT, EDGE_SUB_WARNING, EDGE_WARNING, INIT_NODE, SelectType } from "./constants";
export function convertMappingFrom(nodes, edges, zoom) {
  var mapping = {};
  nodes.forEach(function (node) {
    var width = node.width,
      height = node.height,
      _node$select = node.select,
      select = _node$select === void 0 ? SelectType.DEFAULT : _node$select,
      _node$type = node.type,
      type = _node$type === void 0 ? 'BasicNode' : _node$type,
      _node$position = node.position,
      position = _node$position === void 0 ? {
        x: NaN,
        y: NaN
      } : _node$position;
    mapping[node.id] = _objectSpread(_objectSpread({}, node), {}, {
      id: node.id,
      data: node.data,
      select: select,
      type: type,
      right: [],
      left: [],
      position: position,
      width: width,
      height: height,
      zoom: zoom,
      label: node.label
    });
  });
  edges.forEach(function (edge) {
    var _mapping$source$right, _mapping$target$left;
    var source = edge.source,
      target = edge.target;
    if (mapping[source]) (_mapping$source$right = mapping[source].right) === null || _mapping$source$right === void 0 || _mapping$source$right.push(target);
    if (mapping[target]) (_mapping$target$left = mapping[target].left) === null || _mapping$target$left === void 0 || _mapping$target$left.push(source);
  });
  return mapping;
}
export function setNodePosition(nodes, edges, autoLayout, layoutOptions) {
  if (!autoLayout) {
    return {
      _nodes: nodes.map(function (node) {
        var _node$position2 = node.position,
          _x = _node$position2.x,
          _y = _node$position2.y;
        return _objectSpread(_objectSpread({}, node), {}, {
          position: {
            x: isNaN(_x) ? 1 : _x,
            y: isNaN(_y) ? 1 : _y
          }
        });
      }),
      _edges: edges
    };
  }
  var g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(function () {
    return {};
  });
  g.setGraph(_objectSpread({
    rankdir: 'LR',
    align: 'UL',
    nodesep: 100,
    ranksep: 200
  }, layoutOptions));
  edges.forEach(function (edge) {
    return g.setEdge(edge.source, edge.target);
  });
  nodes.forEach(function (node) {
    return g.setNode(node.id, node);
  });
  Dagre.layout(g);
  return {
    _nodes: nodes.map(function (node) {
      var _g$node = g.node(node.id),
        x = _g$node.x,
        y = _g$node.y;
      var _node$position3 = node.position,
        _x = _node$position3.x,
        _y = _node$position3.y;
      return _objectSpread(_objectSpread({}, node), {}, {
        position: {
          x: isNaN(_x) ? x : _x,
          y: isNaN(_y) ? y : _y
        }
      });
    }),
    _edges: edges
  };
}
export function sortEdges(edges) {
  var highEdges = edges.filter(function (item) {
    var _item$className, _item$className2;
    return ((_item$className = item.className) === null || _item$className === void 0 ? void 0 : _item$className.includes('edgeSelected')) || ((_item$className2 = item.className) === null || _item$className2 === void 0 ? void 0 : _item$className2.includes('edgeSubSelected'));
  });
  var midEdges = edges.filter(function (item) {
    var _item$className3, _item$className4;
    return ((_item$className3 = item.className) === null || _item$className3 === void 0 ? void 0 : _item$className3.includes('edgeDanger')) || ((_item$className4 = item.className) === null || _item$className4 === void 0 ? void 0 : _item$className4.includes('edgeSubDanger'));
  });
  var lowEdges = edges.filter(function (item) {
    var _item$className5, _item$className6, _item$className7, _item$className8;
    return !((_item$className5 = item.className) !== null && _item$className5 !== void 0 && _item$className5.includes('edgeSelected')) && !((_item$className6 = item.className) !== null && _item$className6 !== void 0 && _item$className6.includes('edgeSubSelected')) && !((_item$className7 = item.className) !== null && _item$className7 !== void 0 && _item$className7.includes('edgeDanger')) && !((_item$className8 = item.className) !== null && _item$className8 !== void 0 && _item$className8.includes('edgeSubDanger'));
  });
  return [].concat(_toConsumableArray(lowEdges), _toConsumableArray(midEdges), _toConsumableArray(highEdges));
}
function getEdgeClsFromSelectType(select) {
  switch (select) {
    case SelectType.SELECT:
      return EDGE_SELECT;
    case SelectType.SUB_SELECT:
      return EDGE_SUB_SELECT;
    case SelectType.DANGER:
      return EDGE_DANGER;
    case SelectType.SUB_DANGER:
      return EDGE_SUB_DANGER;
    case SelectType.WARNING:
      return EDGE_WARNING;
    case SelectType.SUB_WARNING:
      return EDGE_SUB_WARNING;
    default:
      return 'edgeDefault';
  }
}
export function getRenderEdges(edges) {
  return edges.map(function (edge) {
    var source = edge.source,
      target = edge.target,
      _edge$select = edge.select,
      select = _edge$select === void 0 ? SelectType.DEFAULT : _edge$select,
      _edge$type = edge.type,
      type = _edge$type === void 0 ? 'smoothstep' : _edge$type,
      label = edge.label,
      animated = edge.animated,
      sourceHandle = edge.sourceHandle,
      targetHandle = edge.targetHandle,
      className = edge.className,
      data = edge.data,
      _edge$id = edge.id,
      id = _edge$id === void 0 ? "".concat(source, "-").concat(target) : _edge$id;
    var _className = getEdgeClsFromSelectType(select) + ' ' + className;
    return _objectSpread(_objectSpread({}, edge), {}, {
      id: id,
      source: source,
      target: target,
      sourceHandle: sourceHandle,
      targetHandle: targetHandle,
      type: type,
      animated: animated,
      select: select,
      label: label,
      data: _objectSpread({
        select: select,
        className: _className
      }, data),
      className: _className
    });
  });
}
var getWidthAndHeight = function getWidthAndHeight(node) {
  if (node.type === 'BasicNode') {
    return {
      width: 320,
      height: 83
    };
  } else if (node.type === 'BasicNodeGroup') {
    return {
      width: 355,
      height: 1100
    };
  } else {
    return {
      width: node.width || 1,
      height: node.height || 1
    };
  }
};
var getHandleType = function getHandleType(node) {
  var _node$left, _node$right, _node$left2, _node$right2;
  if (((_node$left = node.left) === null || _node$left === void 0 ? void 0 : _node$left.length) === 0 && ((_node$right = node.right) === null || _node$right === void 0 ? void 0 : _node$right.length) === 0) {
    return 'none';
  } else if (((_node$left2 = node.left) === null || _node$left2 === void 0 ? void 0 : _node$left2.length) === 0) {
    return 'input';
  } else if (((_node$right2 = node.right) === null || _node$right2 === void 0 ? void 0 : _node$right2.length) === 0) {
    return 'output';
  } else {
    return 'both';
  }
};

// 只有Basic节点才有的额外属性
var getProFlowNodeData = function getProFlowNodeData(node) {
  if (node.type === 'BasicNode') {
    return _objectSpread(_objectSpread({}, node.data), {}, {
      selectType: node.select,
      label: node.label,
      zoom: node.zoom,
      handleType: getHandleType(node)
    });
  } else if (node.type === 'BasicNodeGroup') {
    return {
      data: node.data,
      selectType: node.select,
      label: node.label,
      zoom: node.zoom,
      handleType: getHandleType(node)
    };
  } else {
    return _objectSpread(_objectSpread({}, node.data), {}, {
      selectType: node.select,
      zoom: node.zoom,
      label: node.label
    });
  }
};
export var getRenderData = function getRenderData(mapping, edges, autoLayout, layoutOptions) {
  var renderNodes = [];
  var renderEdges = getRenderEdges(edges);
  Object.keys(mapping).forEach(function (id) {
    var node = mapping[id];
    var type = node.type;
    var _getWidthAndHeight = getWidthAndHeight(node),
      width = _getWidthAndHeight.width,
      height = _getWidthAndHeight.height;
    renderNodes.push(_objectSpread(_objectSpread({}, node), {}, {
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      id: node.id,
      position: node.position,
      type: type,
      width: width,
      height: height,
      className: cx(INIT_NODE),
      data: getProFlowNodeData(node)
    }));
  });
  var _setNodePosition = setNodePosition(renderNodes, renderEdges, autoLayout, layoutOptions),
    _nodes = _setNodePosition._nodes,
    _edges = _setNodePosition._edges;
  return {
    nodes: _nodes,
    edges: sortEdges(_edges)
  };
};
