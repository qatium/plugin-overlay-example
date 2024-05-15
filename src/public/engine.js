var O = Object.defineProperty;
var F = (n, t, o) => t in n ? O(n, t, { enumerable: !0, configurable: !0, writable: !0, value: o }) : n[t] = o;
var x = (n, t, o) => (F(n, typeof t != "symbol" ? t + "" : t, o), o);
function C(n, t = "float32") {
  return n instanceof Date ? "date-millisecond" : n instanceof Number ? t : typeof n == "string" ? "utf8" : "null";
}
function S(n) {
  let t = A(n);
  return t !== "null" ? { type: t, nullable: !1 } : n.length > 0 ? (t = C(n[0]), { type: t, nullable: !0 }) : { type: "null", nullable: !0 };
}
function A(n) {
  switch (n.constructor) {
    case Int8Array:
      return "int8";
    case Uint8Array:
    case Uint8ClampedArray:
      return "uint8";
    case Int16Array:
      return "int16";
    case Uint16Array:
      return "uint16";
    case Int32Array:
      return "int32";
    case Uint32Array:
      return "uint32";
    case Float32Array:
      return "float32";
    case Float64Array:
      return "float64";
    default:
      return "null";
  }
}
function j(n) {
  let t = 1 / 0, o = 1 / 0, e = 1 / 0, r = -1 / 0, i = -1 / 0, l = -1 / 0;
  const p = n.POSITION ? n.POSITION.value : [], y = p && p.length;
  for (let g = 0; g < y; g += 3) {
    const u = p[g], a = p[g + 1], s = p[g + 2];
    t = u < t ? u : t, o = a < o ? a : o, e = s < e ? s : e, r = u > r ? u : r, i = a > i ? a : i, l = s > l ? s : l;
  }
  return [
    [t, o, e],
    [r, i, l]
  ];
}
const w = "0.0.17", I = w, z = "0.0.29", T = (n) => {
  _registerPlugin(n, {
    "@qatium/plugin": z,
    "@qatium/sdk": I
  });
}, M = /^[og]\s*(.+)?/, V = /^mtllib /, _ = /^usemtl /;
class b {
  constructor({ index: t, name: o = "", mtllib: e, smooth: r, groupStart: i }) {
    this.index = t, this.name = o, this.mtllib = e, this.smooth = r, this.groupStart = i, this.groupEnd = -1, this.groupCount = -1, this.inherited = !1;
  }
  clone(t = this.index) {
    return new b({
      index: t,
      name: this.name,
      mtllib: this.mtllib,
      smooth: this.smooth,
      groupStart: 0
    });
  }
}
class E {
  constructor(t = "") {
    this.name = t, this.geometry = {
      vertices: [],
      normals: [],
      colors: [],
      uvs: []
    }, this.materials = [], this.smooth = !0, this.fromDeclaration = null;
  }
  startMaterial(t, o) {
    const e = this._finalize(!1);
    e && (e.inherited || e.groupCount <= 0) && this.materials.splice(e.index, 1);
    const r = new b({
      index: this.materials.length,
      name: t,
      mtllib: Array.isArray(o) && o.length > 0 ? o[o.length - 1] : "",
      smooth: e !== void 0 ? e.smooth : this.smooth,
      groupStart: e !== void 0 ? e.groupEnd : 0
    });
    return this.materials.push(r), r;
  }
  currentMaterial() {
    if (this.materials.length > 0)
      return this.materials[this.materials.length - 1];
  }
  _finalize(t) {
    const o = this.currentMaterial();
    if (o && o.groupEnd === -1 && (o.groupEnd = this.geometry.vertices.length / 3, o.groupCount = o.groupEnd - o.groupStart, o.inherited = !1), t && this.materials.length > 1)
      for (let e = this.materials.length - 1; e >= 0; e--)
        this.materials[e].groupCount <= 0 && this.materials.splice(e, 1);
    return t && this.materials.length === 0 && this.materials.push({
      name: "",
      smooth: this.smooth
    }), o;
  }
}
class G {
  constructor() {
    this.objects = [], this.object = null, this.vertices = [], this.normals = [], this.colors = [], this.uvs = [], this.materialLibraries = [], this.startObject("", !1);
  }
  startObject(t, o = !0) {
    if (this.object && !this.object.fromDeclaration) {
      this.object.name = t, this.object.fromDeclaration = o;
      return;
    }
    const e = this.object && typeof this.object.currentMaterial == "function" ? this.object.currentMaterial() : void 0;
    if (this.object && typeof this.object._finalize == "function" && this.object._finalize(!0), this.object = new E(t), this.object.fromDeclaration = o, e && e.name && typeof e.clone == "function") {
      const r = e.clone(0);
      r.inherited = !0, this.object.materials.push(r);
    }
    this.objects.push(this.object);
  }
  finalize() {
    this.object && typeof this.object._finalize == "function" && this.object._finalize(!0);
  }
  parseVertexIndex(t, o) {
    const e = parseInt(t);
    return (e >= 0 ? e - 1 : e + o / 3) * 3;
  }
  parseNormalIndex(t, o) {
    const e = parseInt(t);
    return (e >= 0 ? e - 1 : e + o / 3) * 3;
  }
  parseUVIndex(t, o) {
    const e = parseInt(t);
    return (e >= 0 ? e - 1 : e + o / 2) * 2;
  }
  addVertex(t, o, e) {
    const r = this.vertices, i = this.object.geometry.vertices;
    i.push(r[t + 0], r[t + 1], r[t + 2]), i.push(r[o + 0], r[o + 1], r[o + 2]), i.push(r[e + 0], r[e + 1], r[e + 2]);
  }
  addVertexPoint(t) {
    const o = this.vertices;
    this.object.geometry.vertices.push(o[t + 0], o[t + 1], o[t + 2]);
  }
  addVertexLine(t) {
    const o = this.vertices;
    this.object.geometry.vertices.push(o[t + 0], o[t + 1], o[t + 2]);
  }
  addNormal(t, o, e) {
    const r = this.normals, i = this.object.geometry.normals;
    i.push(r[t + 0], r[t + 1], r[t + 2]), i.push(r[o + 0], r[o + 1], r[o + 2]), i.push(r[e + 0], r[e + 1], r[e + 2]);
  }
  addColor(t, o, e) {
    const r = this.colors, i = this.object.geometry.colors;
    i.push(r[t + 0], r[t + 1], r[t + 2]), i.push(r[o + 0], r[o + 1], r[o + 2]), i.push(r[e + 0], r[e + 1], r[e + 2]);
  }
  addUV(t, o, e) {
    const r = this.uvs, i = this.object.geometry.uvs;
    i.push(r[t + 0], r[t + 1]), i.push(r[o + 0], r[o + 1]), i.push(r[e + 0], r[e + 1]);
  }
  addUVLine(t) {
    const o = this.uvs;
    this.object.geometry.uvs.push(o[t + 0], o[t + 1]);
  }
  // eslint-disable-next-line max-params
  addFace(t, o, e, r, i, l, p, y, g) {
    const u = this.vertices.length;
    let a = this.parseVertexIndex(t, u), s = this.parseVertexIndex(o, u), c = this.parseVertexIndex(e, u);
    if (this.addVertex(a, s, c), r !== void 0 && r !== "") {
      const d = this.uvs.length;
      a = this.parseUVIndex(r, d), s = this.parseUVIndex(i, d), c = this.parseUVIndex(l, d), this.addUV(a, s, c);
    }
    if (p !== void 0 && p !== "") {
      const d = this.normals.length;
      a = this.parseNormalIndex(p, d), s = p === y ? a : this.parseNormalIndex(y, d), c = p === g ? a : this.parseNormalIndex(g, d), this.addNormal(a, s, c);
    }
    this.colors.length > 0 && this.addColor(a, s, c);
  }
  addPointGeometry(t) {
    this.object.geometry.type = "Points";
    const o = this.vertices.length;
    for (const e of t)
      this.addVertexPoint(this.parseVertexIndex(e, o));
  }
  addLineGeometry(t, o) {
    this.object.geometry.type = "Line";
    const e = this.vertices.length, r = this.uvs.length;
    for (const i of t)
      this.addVertexLine(this.parseVertexIndex(i, e));
    for (const i of o)
      this.addUVLine(this.parseUVIndex(i, r));
  }
}
function R(n) {
  const t = new G();
  n.indexOf(`\r
`) !== -1 && (n = n.replace(/\r\n/g, `
`)), n.indexOf(`\\
`) !== -1 && (n = n.replace(/\\\n/g, ""));
  const o = n.split(`
`);
  let e = "", r = "", i = 0, l = [];
  const p = typeof "".trimLeft == "function";
  for (let u = 0, a = o.length; u < a; u++)
    if (e = o[u], e = p ? e.trimLeft() : e.trim(), i = e.length, i !== 0 && (r = e.charAt(0), r !== "#"))
      if (r === "v") {
        const s = e.split(/\s+/);
        switch (s[0]) {
          case "v":
            t.vertices.push(parseFloat(s[1]), parseFloat(s[2]), parseFloat(s[3])), s.length >= 7 && t.colors.push(parseFloat(s[4]), parseFloat(s[5]), parseFloat(s[6]));
            break;
          case "vn":
            t.normals.push(parseFloat(s[1]), parseFloat(s[2]), parseFloat(s[3]));
            break;
          case "vt":
            t.uvs.push(parseFloat(s[1]), parseFloat(s[2]));
            break;
        }
      } else if (r === "f") {
        const c = e.substr(1).trim().split(/\s+/), d = [];
        for (let m = 0, h = c.length; m < h; m++) {
          const v = c[m];
          if (v.length > 0) {
            const L = v.split("/");
            d.push(L);
          }
        }
        const f = d[0];
        for (let m = 1, h = d.length - 1; m < h; m++) {
          const v = d[m], L = d[m + 1];
          t.addFace(f[0], v[0], L[0], f[1], v[1], L[1], f[2], v[2], L[2]);
        }
      } else if (r === "l") {
        const s = e.substring(1).trim().split(" ");
        let c;
        const d = [];
        if (e.indexOf("/") === -1)
          c = s;
        else {
          c = [];
          for (let f = 0, m = s.length; f < m; f++) {
            const h = s[f].split("/");
            h[0] !== "" && c.push(h[0]), h[1] !== "" && d.push(h[1]);
          }
        }
        t.addLineGeometry(c, d);
      } else if (r === "p") {
        const c = e.substr(1).trim().split(" ");
        t.addPointGeometry(c);
      } else if ((l = M.exec(e)) !== null) {
        const s = (" " + l[0].substr(1).trim()).substr(1);
        t.startObject(s);
      } else if (_.test(e))
        t.object.startMaterial(e.substring(7).trim(), t.materialLibraries);
      else if (V.test(e))
        t.materialLibraries.push(e.substring(7).trim());
      else if (r === "s") {
        if (l = e.split(" "), l.length > 1) {
          const c = l[1].trim().toLowerCase();
          t.object.smooth = c !== "0" && c !== "off";
        } else
          t.object.smooth = !0;
        const s = t.object.currentMaterial();
        s && (s.smooth = t.object.smooth);
      } else {
        if (e === "\0")
          continue;
        throw new Error(`Unexpected line: "${e}"`);
      }
  t.finalize();
  const y = [], g = [];
  for (const u of t.objects) {
    const { geometry: a } = u;
    if (a.vertices.length === 0)
      continue;
    const s = {
      header: {
        vertexCount: a.vertices.length / 3
      },
      attributes: {}
    };
    switch (a.type) {
      case "Points":
        s.mode = 0;
        break;
      case "Line":
        s.mode = 1;
        break;
      default:
        s.mode = 4;
        break;
    }
    s.attributes.POSITION = { value: new Float32Array(a.vertices), size: 3 }, a.normals.length > 0 && (s.attributes.NORMAL = { value: new Float32Array(a.normals), size: 3 }), a.colors.length > 0 && (s.attributes.COLOR_0 = { value: new Float32Array(a.colors), size: 3 }), a.uvs.length > 0 && (s.attributes.TEXCOORD_0 = { value: new Float32Array(a.uvs), size: 2 }), s.materials = [];
    for (const c of u.materials) {
      const d = {
        name: c.name,
        flatShading: !c.smooth
      };
      s.materials.push(d), g.push(d);
    }
    s.name = u.name, y.push(s);
  }
  return { meshes: y, materials: g };
}
function J(n, t = {}) {
  const o = {};
  for (const r in t)
    r !== "value" && (o[r] = JSON.stringify(t[r]));
  const e = [];
  for (const r in n) {
    const i = n[r], l = N(r, i);
    e.push(l);
  }
  return { fields: e, metadata: o };
}
function N(n, t) {
  const o = {};
  for (const i in t)
    i !== "value" && (o[i] = JSON.stringify(t[i]));
  let { type: e } = S(t.value);
  return t.size === 1 || t.size === void 0 || (e = { type: "fixed-size-list", listSize: t.size, children: [{ name: "values", type: e }] }), { name: n, type: e, nullable: !1, metadata: o };
}
function P(n, t) {
  const { meshes: o } = R(n), e = o.reduce((p, y) => p + y.header.vertexCount, 0), r = D(o, e), i = {
    vertexCount: e,
    // @ts-ignore Need to export Attributes type
    boundingBox: j(r)
  }, l = J(r, {
    mode: 4,
    boundingBox: i.boundingBox
  });
  return {
    // Data return by this loader implementation
    loaderData: {
      header: {}
    },
    // Normalised data
    schema: l,
    header: i,
    mode: 4,
    // TRIANGLES
    topology: "point-list",
    attributes: r
  };
}
function D(n, t) {
  const o = new Float32Array(t * 3);
  let e, r, i, l = 0;
  for (const y of n) {
    const { POSITION: g, NORMAL: u, COLOR_0: a, TEXCOORD_0: s } = y.attributes;
    o.set(g.value, l * 3), u && (e = e || new Float32Array(t * 3), e.set(u.value, l * 3)), a && (r = r || new Float32Array(t * 3), r.set(a.value, l * 3)), s && (i = i || new Float32Array(t * 2), i.set(s.value, l * 2)), l += g.value.length / 3;
  }
  const p = {};
  return p.POSITION = { value: o, size: 3 }, e && (p.NORMAL = { value: e, size: 3 }), r && (p.COLOR_0 = { value: r, size: 3 }), i && (p.TEXCOORD_0 = { value: i, size: 2 }), p;
}
const U = "4.2.0", k = {
  dataType: null,
  batchType: null,
  name: "OBJ",
  id: "obj",
  module: "obj",
  version: U,
  worker: !0,
  extensions: ["obj"],
  mimeTypes: ["text/plain"],
  testText: W,
  options: {
    obj: {}
  }
};
function W(n) {
  return n[0] === "v";
}
const B = {
  ...k,
  parse: async (n, t) => P(new TextDecoder().decode(n)),
  parseTextSync: (n, t) => P(n)
};
class X {
  constructor() {
    x(this, "activeOverlay", "ArcLayer");
  }
  run(t) {
    this[this.activeOverlay](t);
  }
  onMessage(t, o) {
    this.activeOverlay = o.overlay, this.run(t);
  }
  SimpleMeshLayer(t) {
    const o = t.network.getJunctions().map((e) => ({
      type: "Feature",
      geometry: e.geometry,
      properties: { pressure: e.simulation.pressure }
    }));
    t.map.addOverlay([{
      id: "SimpleMeshLayer",
      type: "SimpleMeshLayer",
      data: o,
      visible: !0,
      loaders: [B],
      mesh: "http://localhost:8888/teapot.obj",
      sizeScale: 10,
      getPosition: (e) => e.geometry.coordinates,
      getWeight: (e) => e.properties.pressure,
      getOrientation: () => [0, 90, 90],
      getColor: (e) => [e.properties.pressure, 255, e.properties.pressure, 255]
    }]);
  }
  HeatmapLayer(t) {
    const o = t.network.getJunctions().map((e) => ({
      type: "Feature",
      geometry: e.geometry,
      properties: { pressure: e.simulation.pressure }
    }));
    t.map.addOverlay([{
      id: "ScreenGridLayer",
      type: "HeatmapLayer",
      data: o,
      visible: !0,
      aggregation: "MEAN",
      radiusPixels: 25,
      opacity: 0.4,
      getPosition: (e) => e.geometry.coordinates,
      getWeight: (e) => e.properties.pressure
    }]);
  }
  ScreenGridLayer(t) {
    const o = t.network.getJunctions().map((e) => ({
      type: "Feature",
      geometry: e.geometry,
      properties: { pressure: e.simulation.pressure }
    }));
    t.map.addOverlay([{
      id: "ScreenGridLayer",
      type: "ScreenGridLayer",
      data: o,
      visible: !0,
      cellSizePixels: 50,
      colorRange: [
        [0, 25, 0, 25],
        [0, 85, 0, 85],
        [0, 127, 0, 127],
        [0, 170, 0, 170],
        [0, 190, 0, 190],
        [0, 255, 0, 255]
      ],
      getPosition: (e) => e.geometry.coordinates,
      getWeight: (e) => e.properties.pressure
    }]);
  }
  ContourLayer(t) {
    const o = t.network.getJunctions().map((e) => ({
      type: "Feature",
      geometry: e.geometry,
      properties: { pressure: e.simulation.pressure }
    }));
    t.map.addOverlay([{
      id: "ContourLayer",
      type: "ContourLayer",
      data: o,
      cellSize: 100,
      contours: [
        { threshold: 60, color: [255, 0, 0], strokeWidth: 2, zIndex: 1 },
        { threshold: 70, color: [55, 0, 55], zIndex: 0 },
        { threshold: 80, color: [0, 255, 0], strokeWidth: 6, zIndex: 2 },
        { threshold: 100, color: [0, 0, 255], strokeWidth: 4, zIndex: 3 }
      ],
      getPosition: (e) => e.geometry.coordinates,
      getWeight: (e) => e.properties.pressure,
      aggregation: "MAX"
    }]);
  }
  TextLayer(t) {
    const o = t.network.getTanks().map((e) => ({
      type: "Feature",
      geometry: e.geometry,
      properties: { id: e.id }
    }));
    t.map.addOverlay([{
      id: "TextLayer",
      type: "TextLayer",
      data: o,
      getPosition: (e) => [e.geometry.coordinates[0], e.geometry.coordinates[1], 10],
      getText: (e) => e.properties.id,
      getSize: () => 24,
      getColor: () => [255, 255, 255, 255],
      fontFamily: "Arial"
    }]);
  }
  GeoJsonLayer(t) {
    const o = t.network.getPipes().map((e) => ({
      type: "Feature",
      geometry: e.geometry,
      properties: {}
    }));
    t.map.addOverlay([{
      id: "GeoJsonLayer",
      type: "GeoJsonLayer",
      data: o,
      getLineColor: [128, 0, 255, 255],
      getLineWidth: 20
    }]);
  }
  SolidPolygonLayer(t) {
    var e, r, i;
    const o = [{
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          (e = t.network.getAsset("Nellybay")) == null ? void 0 : e.geometry.coordinates,
          (r = t.network.getAsset("Mandalay_P1")) == null ? void 0 : r.geometry.coordinates,
          (i = t.network.getAsset("Arcadia_DMA_PRV")) == null ? void 0 : i.geometry.coordinates
        ]
      },
      properties: {}
    }];
    t.map.addOverlay([{
      id: "SolidPolygonLayer",
      type: "SolidPolygonLayer",
      data: o,
      extruded: !0,
      getPolygon: (l) => l.geometry.coordinates,
      getElevation: () => 100,
      getFillColor: () => [64, 140, 0, 255],
      getLineColor: [255, 255, 255, 255],
      getLineWidth: 20
    }]);
  }
  PolygonLayer(t) {
    var e, r, i;
    const o = [{
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          (e = t.network.getAsset("Nellybay")) == null ? void 0 : e.geometry.coordinates,
          (r = t.network.getAsset("Mandalay_P1")) == null ? void 0 : r.geometry.coordinates,
          (i = t.network.getAsset("Arcadia_DMA_PRV")) == null ? void 0 : i.geometry.coordinates
        ]
      },
      properties: {}
    }];
    t.map.addOverlay([{
      id: "PolygonLayer",
      type: "PolygonLayer",
      data: o,
      getPolygon: (l) => l.geometry.coordinates,
      getElevation: () => 10,
      getFillColor: () => [64, 140, 0, 255],
      getLineColor: [255, 255, 255, 255],
      getLineWidth: 20
    }]);
  }
  PathLayer(t) {
    const o = t.network.getPipes().map((e) => ({
      type: "Feature",
      geometry: e.geometry,
      properties: {}
    }));
    t.map.addOverlay([{
      type: "PathLayer",
      id: "PathLayer",
      data: o,
      getWidth: () => 8,
      getColor: () => [128, 0, 128, 255],
      getPath: (e) => e.geometry.coordinates.map((r) => [r[0], r[1], 10]),
      visible: !0
    }]);
  }
  TripsLayer(t) {
    const e = t.network.getPipes().map((r) => ({
      type: "Feature",
      geometry: r.geometry,
      properties: {
        timestamps: r.geometry.coordinates.map((i, l) => l / r.geometry.coordinates.length * 1e3)
      }
    }));
    t.map.addOverlay([{
      type: "TripsLayer",
      id: "TripsLayer",
      data: e,
      positionFormat: "XY",
      widthUnits: "pixels",
      capRounded: !1,
      jointRounded: !0,
      fadeTrail: !0,
      getWidth: () => 8,
      getPath: (r) => r.geometry.coordinates,
      getColor: () => [255, 0, 255, 255],
      getTimestamps: (r) => r.properties.timestamps,
      currentTime: 1e3,
      trailLength: 1e3 / 2,
      visible: !0
    }]);
  }
  GridCellLayer(t) {
    const o = t.network.getJunctions().map((e) => ({
      type: "Feature",
      geometry: e.geometry,
      properties: { elevation: e.elevation }
    }));
    t.map.addOverlay([{
      id: "GridCellLayer",
      type: "GridCellLayer",
      data: o,
      getPosition: (e) => {
        const r = e.geometry.coordinates;
        return [r[0], r[1], e.properties.elevation];
      },
      diskResolution: 12,
      extruded: !0,
      cellSize: 50,
      elevationScale: 10,
      getElevation: (e) => e.properties.elevation,
      getFillColor: (e) => [48, 128, e.properties.elevation * 10, 255]
    }]);
  }
  GridLayer(t) {
    const o = t.network.getJunctions().map((e) => ({
      type: "Feature",
      geometry: e.geometry,
      properties: { elevation: e.elevation }
    }));
    t.map.addOverlay([{
      id: "GridLayer",
      type: "GridLayer",
      data: o,
      getPosition: (e) => {
        const r = e.geometry.coordinates;
        return [r[0], r[1], e.properties.elevation];
      },
      diskResolution: 12,
      extruded: !0,
      cellSize: 80,
      elevationScale: 1,
      getElevation: (e) => e.properties.elevation,
      getFillColor: (e) => [48, 128, e.properties.elevation * 10, 255],
      _filterData: null
    }]);
  }
  CPUGridLayer(t) {
    const o = t.network.getJunctions().map((e) => ({
      type: "Feature",
      geometry: e.geometry,
      properties: { elevation: e.elevation }
    }));
    t.map.addOverlay([{
      id: "CPUGridLayer",
      type: "CPUGridLayer",
      data: o,
      getPosition: (e) => {
        const r = e.geometry.coordinates;
        return [r[0], r[1], e.properties.elevation];
      },
      diskResolution: 12,
      extruded: !0,
      cellSize: 80,
      elevationScale: 1,
      getElevation: (e) => e.properties.elevation,
      getFillColor: (e) => [48, 128, e.properties.elevation * 10, 255],
      _filterData: null
    }]);
  }
  GPUGridLayer(t) {
    const o = t.network.getJunctions().map((e) => ({
      type: "Feature",
      geometry: e.geometry,
      properties: { elevation: e.elevation }
    }));
    t.map.addOverlay([{
      id: "GPUGridLayer",
      type: "GPUGridLayer",
      data: o,
      getPosition: (e) => {
        const r = e.geometry.coordinates;
        return [r[0], r[1], e.properties.elevation];
      },
      diskResolution: 12,
      extruded: !0,
      cellSize: 80,
      elevationScale: 1,
      getElevation: (e) => e.properties.elevation,
      getFillColor: (e) => [48, 128, e.properties.elevation * 10, 255],
      _filterData: null
    }]);
  }
  ColumnLayer(t) {
    const o = t.network.getJunctions().map((e) => ({
      type: "Feature",
      geometry: e.geometry,
      properties: { elevation: e.elevation }
    }));
    t.map.addOverlay([{
      id: "ColumnLayer",
      type: "ColumnLayer",
      data: o,
      getPosition: (e) => {
        const r = e.geometry.coordinates;
        return [r[0], r[1], e.properties.elevation];
      },
      diskResolution: 12,
      extruded: !0,
      radius: 30,
      elevationScale: 10,
      getElevation: (e) => e.properties.elevation,
      getFillColor: (e) => [48, 128, e.properties.elevation * 10, 255]
    }]);
  }
  ScatterplotLayer(t) {
    const o = t.network.getJunctions().map((e) => ({
      type: "Feature",
      geometry: e.geometry,
      properties: { elevation: e.elevation }
    }));
    t.map.addOverlay([{
      id: "ScatterplotLayer",
      type: "ScatterplotLayer",
      data: o,
      stroked: !0,
      getPosition: (e) => {
        const r = e.geometry.coordinates;
        return [r[0], r[1], e.properties.elevation];
      },
      getRadius: () => 2,
      getFillColor: [255, 140, 0],
      getLineColor: [0, 0, 0],
      getLineWidth: 2,
      radiusScale: 6,
      pickable: !0
    }]);
  }
  PointCloudLayer(t) {
    const o = t.network.getJunctions().map((e) => ({
      type: "Feature",
      geometry: e.geometry,
      properties: { elevation: e.elevation }
    }));
    t.map.addOverlay([{
      id: "PointCloudLayer",
      type: "PointCloudLayer",
      data: o,
      getPosition: (e) => {
        const r = e.geometry.coordinates;
        return [r[0], r[1], e.properties.elevation];
      },
      getNormal: () => [1, 0, 0],
      getColor: () => [255, 0, 255, 255],
      pointSize: 4,
      coordinateOrigin: [t.map.getCamera().center.lng, t.map.getCamera().center.lat, 10]
    }]);
  }
  LineLayer(t) {
    const o = t.network.getPipes().map((e) => ({
      type: "Feature",
      geometry: e.geometry,
      properties: {}
    }));
    t.map.addOverlay([{
      id: "LineLayer",
      type: "LineLayer",
      data: o,
      getSourcePosition: (e) => {
        const r = e.geometry.coordinates[0];
        return [r[0], r[1], 0];
      },
      getTargetPosition: (e) => {
        const r = e.geometry.coordinates[e.geometry.coordinates.length - 1];
        return [r[0], r[1], 0];
      },
      getColor: () => [255, 0, 255, 128],
      getWidth: 12,
      pickable: !0
    }]);
  }
  IconLayer(t) {
    const o = t.network.getJunctions().map((r) => ({
      type: "Feature",
      geometry: r.geometry,
      properties: {}
    })), e = {
      hamburger: {
        x: 0,
        y: 0,
        width: 160,
        height: 160,
        mask: !1,
        anchorX: 80,
        anchorY: 80
      },
      paella: {
        x: 160,
        y: 0,
        width: 160,
        height: 160,
        mask: !1,
        anchorX: 80,
        anchorY: 80
      }
    };
    t.map.addOverlay([{
      id: "IconLayer",
      type: "IconLayer",
      data: o,
      getIcon: () => Math.random() > 0.5 ? "hamburger" : "paella",
      getColor: () => [255, 255, 255, 255],
      getPosition: (r) => {
        const i = r.geometry.coordinates;
        return [i[0], i[1], 0];
      },
      getSize: () => 24,
      visible: !0,
      iconAtlas: "http://localhost:8888/atlas.png",
      iconMapping: e,
      billboard: !0
    }]);
  }
  ArcLayer(t) {
    const o = t.network.getPipes().map((e) => {
      var r, i;
      return {
        type: "Feature",
        geometry: e.geometry,
        properties: {
          sourcePressure: (r = t.network.getNeighborAssets(e.id)[0].simulation) == null ? void 0 : r.pressure,
          targetPressure: (i = t.network.getNeighborAssets(e.id)[1].simulation) == null ? void 0 : i.pressure
        }
      };
    });
    t.map.addOverlay([{
      id: "ArcLayer",
      data: o,
      type: "ArcLayer",
      getSourcePosition: (e) => {
        const r = e.geometry.coordinates[0];
        return [r[0], r[1], 0];
      },
      getTargetPosition: (e) => {
        const r = e.geometry.coordinates[e.geometry.coordinates.length - 1];
        return [r[0], r[1], 0];
      },
      getHeight: 1,
      getSourceColor: (e) => [e.properties.sourcePressure * 2, 0, 255, 255],
      getTargetColor: (e) => [e.properties.targetPressure * 2, 0, 130, 255],
      getWidth: 4
    }]);
  }
}
T(new X());
