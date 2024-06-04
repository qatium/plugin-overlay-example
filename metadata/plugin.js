var P = Object.defineProperty;
var O = (n, r, e) => r in n ? P(n, r, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[r] = e;
var b = (n, r, e) => (O(n, typeof r != "symbol" ? r + "" : r, e), e);
const F = "0.0.19", C = F, S = "0.0.34", A = (n) => {
  _registerPlugin(n, {
    "@qatium/plugin": S,
    "@qatium/sdk": C
  });
};
function j(n, r = "float32") {
  return n instanceof Date ? "date-millisecond" : n instanceof Number ? r : typeof n == "string" ? "utf8" : "null";
}
function w(n) {
  let r = I(n);
  return r !== "null" ? { type: r, nullable: !1 } : n.length > 0 ? (r = j(n[0]), { type: r, nullable: !0 }) : { type: "null", nullable: !0 };
}
function I(n) {
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
function z(n) {
  let r = 1 / 0, e = 1 / 0, t = 1 / 0, o = -1 / 0, s = -1 / 0, l = -1 / 0;
  const d = n.POSITION ? n.POSITION.value : [], y = d && d.length;
  for (let g = 0; g < y; g += 3) {
    const p = d[g], a = d[g + 1], i = d[g + 2];
    r = p < r ? p : r, e = a < e ? a : e, t = i < t ? i : t, o = p > o ? p : o, s = a > s ? a : s, l = i > l ? i : l;
  }
  return [
    [r, e, t],
    [o, s, l]
  ];
}
const T = /^[og]\s*(.+)?/, M = /^mtllib /, V = /^usemtl /;
class k {
  constructor({ index: r, name: e = "", mtllib: t, smooth: o, groupStart: s }) {
    this.index = r, this.name = e, this.mtllib = t, this.smooth = o, this.groupStart = s, this.groupEnd = -1, this.groupCount = -1, this.inherited = !1;
  }
  clone(r = this.index) {
    return new k({
      index: r,
      name: this.name,
      mtllib: this.mtllib,
      smooth: this.smooth,
      groupStart: 0
    });
  }
}
class _ {
  constructor(r = "") {
    this.name = r, this.geometry = {
      vertices: [],
      normals: [],
      colors: [],
      uvs: []
    }, this.materials = [], this.smooth = !0, this.fromDeclaration = null;
  }
  startMaterial(r, e) {
    const t = this._finalize(!1);
    t && (t.inherited || t.groupCount <= 0) && this.materials.splice(t.index, 1);
    const o = new k({
      index: this.materials.length,
      name: r,
      mtllib: Array.isArray(e) && e.length > 0 ? e[e.length - 1] : "",
      smooth: t !== void 0 ? t.smooth : this.smooth,
      groupStart: t !== void 0 ? t.groupEnd : 0
    });
    return this.materials.push(o), o;
  }
  currentMaterial() {
    if (this.materials.length > 0)
      return this.materials[this.materials.length - 1];
  }
  _finalize(r) {
    const e = this.currentMaterial();
    if (e && e.groupEnd === -1 && (e.groupEnd = this.geometry.vertices.length / 3, e.groupCount = e.groupEnd - e.groupStart, e.inherited = !1), r && this.materials.length > 1)
      for (let t = this.materials.length - 1; t >= 0; t--)
        this.materials[t].groupCount <= 0 && this.materials.splice(t, 1);
    return r && this.materials.length === 0 && this.materials.push({
      name: "",
      smooth: this.smooth
    }), e;
  }
}
class G {
  constructor() {
    this.objects = [], this.object = null, this.vertices = [], this.normals = [], this.colors = [], this.uvs = [], this.materialLibraries = [], this.startObject("", !1);
  }
  startObject(r, e = !0) {
    if (this.object && !this.object.fromDeclaration) {
      this.object.name = r, this.object.fromDeclaration = e;
      return;
    }
    const t = this.object && typeof this.object.currentMaterial == "function" ? this.object.currentMaterial() : void 0;
    if (this.object && typeof this.object._finalize == "function" && this.object._finalize(!0), this.object = new _(r), this.object.fromDeclaration = e, t && t.name && typeof t.clone == "function") {
      const o = t.clone(0);
      o.inherited = !0, this.object.materials.push(o);
    }
    this.objects.push(this.object);
  }
  finalize() {
    this.object && typeof this.object._finalize == "function" && this.object._finalize(!0);
  }
  parseVertexIndex(r, e) {
    const t = parseInt(r);
    return (t >= 0 ? t - 1 : t + e / 3) * 3;
  }
  parseNormalIndex(r, e) {
    const t = parseInt(r);
    return (t >= 0 ? t - 1 : t + e / 3) * 3;
  }
  parseUVIndex(r, e) {
    const t = parseInt(r);
    return (t >= 0 ? t - 1 : t + e / 2) * 2;
  }
  addVertex(r, e, t) {
    const o = this.vertices, s = this.object.geometry.vertices;
    s.push(o[r + 0], o[r + 1], o[r + 2]), s.push(o[e + 0], o[e + 1], o[e + 2]), s.push(o[t + 0], o[t + 1], o[t + 2]);
  }
  addVertexPoint(r) {
    const e = this.vertices;
    this.object.geometry.vertices.push(e[r + 0], e[r + 1], e[r + 2]);
  }
  addVertexLine(r) {
    const e = this.vertices;
    this.object.geometry.vertices.push(e[r + 0], e[r + 1], e[r + 2]);
  }
  addNormal(r, e, t) {
    const o = this.normals, s = this.object.geometry.normals;
    s.push(o[r + 0], o[r + 1], o[r + 2]), s.push(o[e + 0], o[e + 1], o[e + 2]), s.push(o[t + 0], o[t + 1], o[t + 2]);
  }
  addColor(r, e, t) {
    const o = this.colors, s = this.object.geometry.colors;
    s.push(o[r + 0], o[r + 1], o[r + 2]), s.push(o[e + 0], o[e + 1], o[e + 2]), s.push(o[t + 0], o[t + 1], o[t + 2]);
  }
  addUV(r, e, t) {
    const o = this.uvs, s = this.object.geometry.uvs;
    s.push(o[r + 0], o[r + 1]), s.push(o[e + 0], o[e + 1]), s.push(o[t + 0], o[t + 1]);
  }
  addUVLine(r) {
    const e = this.uvs;
    this.object.geometry.uvs.push(e[r + 0], e[r + 1]);
  }
  // eslint-disable-next-line max-params
  addFace(r, e, t, o, s, l, d, y, g) {
    const p = this.vertices.length;
    let a = this.parseVertexIndex(r, p), i = this.parseVertexIndex(e, p), c = this.parseVertexIndex(t, p);
    if (this.addVertex(a, i, c), o !== void 0 && o !== "") {
      const u = this.uvs.length;
      a = this.parseUVIndex(o, u), i = this.parseUVIndex(s, u), c = this.parseUVIndex(l, u), this.addUV(a, i, c);
    }
    if (d !== void 0 && d !== "") {
      const u = this.normals.length;
      a = this.parseNormalIndex(d, u), i = d === y ? a : this.parseNormalIndex(y, u), c = d === g ? a : this.parseNormalIndex(g, u), this.addNormal(a, i, c);
    }
    this.colors.length > 0 && this.addColor(a, i, c);
  }
  addPointGeometry(r) {
    this.object.geometry.type = "Points";
    const e = this.vertices.length;
    for (const t of r)
      this.addVertexPoint(this.parseVertexIndex(t, e));
  }
  addLineGeometry(r, e) {
    this.object.geometry.type = "Line";
    const t = this.vertices.length, o = this.uvs.length;
    for (const s of r)
      this.addVertexLine(this.parseVertexIndex(s, t));
    for (const s of e)
      this.addUVLine(this.parseUVIndex(s, o));
  }
}
function R(n) {
  const r = new G();
  n.indexOf(`\r
`) !== -1 && (n = n.replace(/\r\n/g, `
`)), n.indexOf(`\\
`) !== -1 && (n = n.replace(/\\\n/g, ""));
  const e = n.split(`
`);
  let t = "", o = "", s = 0, l = [];
  const d = typeof "".trimLeft == "function";
  for (let p = 0, a = e.length; p < a; p++)
    if (t = e[p], t = d ? t.trimLeft() : t.trim(), s = t.length, s !== 0 && (o = t.charAt(0), o !== "#"))
      if (o === "v") {
        const i = t.split(/\s+/);
        switch (i[0]) {
          case "v":
            r.vertices.push(parseFloat(i[1]), parseFloat(i[2]), parseFloat(i[3])), i.length >= 7 && r.colors.push(parseFloat(i[4]), parseFloat(i[5]), parseFloat(i[6]));
            break;
          case "vn":
            r.normals.push(parseFloat(i[1]), parseFloat(i[2]), parseFloat(i[3]));
            break;
          case "vt":
            r.uvs.push(parseFloat(i[1]), parseFloat(i[2]));
            break;
        }
      } else if (o === "f") {
        const c = t.substr(1).trim().split(/\s+/), u = [];
        for (let m = 0, h = c.length; m < h; m++) {
          const v = c[m];
          if (v.length > 0) {
            const L = v.split("/");
            u.push(L);
          }
        }
        const f = u[0];
        for (let m = 1, h = u.length - 1; m < h; m++) {
          const v = u[m], L = u[m + 1];
          r.addFace(f[0], v[0], L[0], f[1], v[1], L[1], f[2], v[2], L[2]);
        }
      } else if (o === "l") {
        const i = t.substring(1).trim().split(" ");
        let c;
        const u = [];
        if (t.indexOf("/") === -1)
          c = i;
        else {
          c = [];
          for (let f = 0, m = i.length; f < m; f++) {
            const h = i[f].split("/");
            h[0] !== "" && c.push(h[0]), h[1] !== "" && u.push(h[1]);
          }
        }
        r.addLineGeometry(c, u);
      } else if (o === "p") {
        const c = t.substr(1).trim().split(" ");
        r.addPointGeometry(c);
      } else if ((l = T.exec(t)) !== null) {
        const i = (" " + l[0].substr(1).trim()).substr(1);
        r.startObject(i);
      } else if (V.test(t))
        r.object.startMaterial(t.substring(7).trim(), r.materialLibraries);
      else if (M.test(t))
        r.materialLibraries.push(t.substring(7).trim());
      else if (o === "s") {
        if (l = t.split(" "), l.length > 1) {
          const c = l[1].trim().toLowerCase();
          r.object.smooth = c !== "0" && c !== "off";
        } else
          r.object.smooth = !0;
        const i = r.object.currentMaterial();
        i && (i.smooth = r.object.smooth);
      } else {
        if (t === "\0")
          continue;
        throw new Error(`Unexpected line: "${t}"`);
      }
  r.finalize();
  const y = [], g = [];
  for (const p of r.objects) {
    const { geometry: a } = p;
    if (a.vertices.length === 0)
      continue;
    const i = {
      header: {
        vertexCount: a.vertices.length / 3
      },
      attributes: {}
    };
    switch (a.type) {
      case "Points":
        i.mode = 0;
        break;
      case "Line":
        i.mode = 1;
        break;
      default:
        i.mode = 4;
        break;
    }
    i.attributes.POSITION = { value: new Float32Array(a.vertices), size: 3 }, a.normals.length > 0 && (i.attributes.NORMAL = { value: new Float32Array(a.normals), size: 3 }), a.colors.length > 0 && (i.attributes.COLOR_0 = { value: new Float32Array(a.colors), size: 3 }), a.uvs.length > 0 && (i.attributes.TEXCOORD_0 = { value: new Float32Array(a.uvs), size: 2 }), i.materials = [];
    for (const c of p.materials) {
      const u = {
        name: c.name,
        flatShading: !c.smooth
      };
      i.materials.push(u), g.push(u);
    }
    i.name = p.name, y.push(i);
  }
  return { meshes: y, materials: g };
}
function E(n, r = {}) {
  const e = {};
  for (const o in r)
    o !== "value" && (e[o] = JSON.stringify(r[o]));
  const t = [];
  for (const o in n) {
    const s = n[o], l = J(o, s);
    t.push(l);
  }
  return { fields: t, metadata: e };
}
function J(n, r) {
  const e = {};
  for (const s in r)
    s !== "value" && (e[s] = JSON.stringify(r[s]));
  let { type: t } = w(r.value);
  return r.size === 1 || r.size === void 0 || (t = { type: "fixed-size-list", listSize: r.size, children: [{ name: "values", type: t }] }), { name: n, type: t, nullable: !1, metadata: e };
}
function x(n, r) {
  const { meshes: e } = R(n), t = e.reduce((d, y) => d + y.header.vertexCount, 0), o = N(e, t), s = {
    vertexCount: t,
    // @ts-ignore Need to export Attributes type
    boundingBox: z(o)
  }, l = E(o, {
    mode: 4,
    boundingBox: s.boundingBox
  });
  return {
    // Data return by this loader implementation
    loaderData: {
      header: {}
    },
    // Normalised data
    schema: l,
    header: s,
    mode: 4,
    // TRIANGLES
    topology: "point-list",
    attributes: o
  };
}
function N(n, r) {
  const e = new Float32Array(r * 3);
  let t, o, s, l = 0;
  for (const y of n) {
    const { POSITION: g, NORMAL: p, COLOR_0: a, TEXCOORD_0: i } = y.attributes;
    e.set(g.value, l * 3), p && (t = t || new Float32Array(r * 3), t.set(p.value, l * 3)), a && (o = o || new Float32Array(r * 3), o.set(a.value, l * 3)), i && (s = s || new Float32Array(r * 2), s.set(i.value, l * 2)), l += g.value.length / 3;
  }
  const d = {};
  return d.POSITION = { value: e, size: 3 }, t && (d.NORMAL = { value: t, size: 3 }), o && (d.COLOR_0 = { value: o, size: 3 }), s && (d.TEXCOORD_0 = { value: s, size: 2 }), d;
}
const D = "4.2.1", U = {
  dataType: null,
  batchType: null,
  name: "OBJ",
  id: "obj",
  module: "obj",
  version: D,
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
  ...U,
  parse: async (n, r) => x(new TextDecoder().decode(n)),
  parseTextSync: (n, r) => x(n)
};
class X {
  constructor() {
    b(this, "activeOverlay", "ArcLayer");
  }
  run() {
    this[this.activeOverlay]();
  }
  onMessage(r) {
    this.activeOverlay = r.overlay, this.run();
  }
  SimpleMeshLayer() {
    const r = sdk.network.getJunctions().map((e) => ({
      type: "Feature",
      geometry: e.geometry,
      properties: { pressure: e.simulation.pressure }
    }));
    sdk.map.addOverlay([{
      id: "SimpleMeshLayer",
      type: "SimpleMeshLayer",
      data: r,
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
  HeatmapLayer() {
    const r = sdk.network.getJunctions().map((e) => ({
      type: "Feature",
      geometry: e.geometry,
      properties: { pressure: e.simulation.pressure }
    }));
    sdk.map.addOverlay([{
      id: "ScreenGridLayer",
      type: "HeatmapLayer",
      data: r,
      visible: !0,
      aggregation: "MEAN",
      radiusPixels: 25,
      opacity: 0.4,
      getPosition: (e) => e.geometry.coordinates,
      getWeight: (e) => e.properties.pressure
    }]);
  }
  ScreenGridLayer() {
    const r = sdk.network.getJunctions().map((e) => ({
      type: "Feature",
      geometry: e.geometry,
      properties: { pressure: e.simulation.pressure }
    }));
    sdk.map.addOverlay([{
      id: "ScreenGridLayer",
      type: "ScreenGridLayer",
      data: r,
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
  ContourLayer() {
    const r = sdk.network.getJunctions().map((e) => ({
      type: "Feature",
      geometry: e.geometry,
      properties: { pressure: e.simulation.pressure }
    }));
    sdk.map.addOverlay([{
      id: "ContourLayer",
      type: "ContourLayer",
      data: r,
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
  TextLayer() {
    const r = sdk.network.getTanks().map((e) => ({
      type: "Feature",
      geometry: e.geometry,
      properties: { id: e.id }
    }));
    sdk.map.addOverlay([{
      id: "TextLayer",
      type: "TextLayer",
      data: r,
      getPosition: (e) => [e.geometry.coordinates[0], e.geometry.coordinates[1], 10],
      getText: (e) => e.properties.id,
      getSize: () => 24,
      getColor: () => [255, 255, 255, 255],
      fontFamily: "Arial"
    }]);
  }
  GeoJsonLayer() {
    const r = sdk.network.getPipes().map((e) => ({
      type: "Feature",
      geometry: e.geometry,
      properties: {}
    }));
    sdk.map.addOverlay([{
      id: "GeoJsonLayer",
      type: "GeoJsonLayer",
      data: r,
      getLineColor: [128, 0, 255, 255],
      getLineWidth: 20
    }]);
  }
  SolidPolygonLayer() {
    var e, t, o;
    const r = [{
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          (e = sdk.network.getAsset("Nellybay")) == null ? void 0 : e.geometry.coordinates,
          (t = sdk.network.getAsset("Mandalay_P1")) == null ? void 0 : t.geometry.coordinates,
          (o = sdk.network.getAsset("Arcadia_DMA_PRV")) == null ? void 0 : o.geometry.coordinates
        ]
      },
      properties: {}
    }];
    sdk.map.addOverlay([{
      id: "SolidPolygonLayer",
      type: "SolidPolygonLayer",
      data: r,
      extruded: !0,
      getPolygon: (s) => s.geometry.coordinates,
      getElevation: () => 100,
      getFillColor: () => [64, 140, 0, 255],
      getLineColor: [255, 255, 255, 255],
      getLineWidth: 20
    }]);
  }
  PolygonLayer() {
    var e, t, o;
    const r = [{
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          (e = sdk.network.getAsset("Nellybay")) == null ? void 0 : e.geometry.coordinates,
          (t = sdk.network.getAsset("Mandalay_P1")) == null ? void 0 : t.geometry.coordinates,
          (o = sdk.network.getAsset("Arcadia_DMA_PRV")) == null ? void 0 : o.geometry.coordinates
        ]
      },
      properties: {}
    }];
    sdk.map.addOverlay([{
      id: "PolygonLayer",
      type: "PolygonLayer",
      data: r,
      getPolygon: (s) => s.geometry.coordinates,
      getElevation: () => 10,
      getFillColor: () => [64, 140, 0, 255],
      getLineColor: [255, 255, 255, 255],
      getLineWidth: 20
    }]);
  }
  PathLayer() {
    const r = sdk.network.getPipes().map((e) => ({
      type: "Feature",
      geometry: e.geometry,
      properties: {}
    }));
    sdk.map.addOverlay([{
      type: "PathLayer",
      id: "PathLayer",
      data: r,
      getWidth: () => 8,
      getColor: () => [128, 0, 128, 255],
      getPath: (e) => e.geometry.coordinates.map((t) => [t[0], t[1], 10]),
      visible: !0
    }]);
  }
  TripsLayer() {
    const e = sdk.network.getPipes().map((t) => ({
      type: "Feature",
      geometry: t.geometry,
      properties: {
        timestamps: t.geometry.coordinates.map((o, s) => s / t.geometry.coordinates.length * 1e3)
      }
    }));
    sdk.map.addOverlay([{
      type: "TripsLayer",
      id: "TripsLayer",
      data: e,
      positionFormat: "XY",
      widthUnits: "pixels",
      capRounded: !1,
      jointRounded: !0,
      fadeTrail: !0,
      getWidth: () => 8,
      getPath: (t) => t.geometry.coordinates,
      getColor: () => [255, 0, 255, 255],
      getTimestamps: (t) => t.properties.timestamps,
      currentTime: 1e3,
      trailLength: 1e3 / 2,
      visible: !0
    }]);
  }
  GridCellLayer() {
    const r = sdk.network.getJunctions().map((e) => ({
      type: "Feature",
      geometry: e.geometry,
      properties: { elevation: e.elevation }
    }));
    sdk.map.addOverlay([{
      id: "GridCellLayer",
      type: "GridCellLayer",
      data: r,
      getPosition: (e) => {
        const t = e.geometry.coordinates;
        return [t[0], t[1], e.properties.elevation];
      },
      diskResolution: 12,
      extruded: !0,
      cellSize: 50,
      elevationScale: 10,
      getElevation: (e) => e.properties.elevation,
      getFillColor: (e) => [48, 128, e.properties.elevation * 10, 255]
    }]);
  }
  GridLayer() {
    const r = sdk.network.getJunctions().map((e) => ({
      type: "Feature",
      geometry: e.geometry,
      properties: { elevation: e.elevation }
    }));
    sdk.map.addOverlay([{
      id: "GridLayer",
      type: "GridLayer",
      data: r,
      getPosition: (e) => {
        const t = e.geometry.coordinates;
        return [t[0], t[1], e.properties.elevation];
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
  CPUGridLayer() {
    const r = sdk.network.getJunctions().map((e) => ({
      type: "Feature",
      geometry: e.geometry,
      properties: { elevation: e.elevation }
    }));
    sdk.map.addOverlay([{
      id: "CPUGridLayer",
      type: "CPUGridLayer",
      data: r,
      getPosition: (e) => {
        const t = e.geometry.coordinates;
        return [t[0], t[1], e.properties.elevation];
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
  GPUGridLayer() {
    const r = sdk.network.getJunctions().map((e) => ({
      type: "Feature",
      geometry: e.geometry,
      properties: { elevation: e.elevation }
    }));
    sdk.map.addOverlay([{
      id: "GPUGridLayer",
      type: "GPUGridLayer",
      data: r,
      getPosition: (e) => {
        const t = e.geometry.coordinates;
        return [t[0], t[1], e.properties.elevation];
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
  ColumnLayer() {
    const r = sdk.network.getJunctions().map((e) => ({
      type: "Feature",
      geometry: e.geometry,
      properties: { elevation: e.elevation }
    }));
    sdk.map.addOverlay([{
      id: "ColumnLayer",
      type: "ColumnLayer",
      data: r,
      getPosition: (e) => {
        const t = e.geometry.coordinates;
        return [t[0], t[1], e.properties.elevation];
      },
      diskResolution: 12,
      extruded: !0,
      radius: 30,
      elevationScale: 10,
      getElevation: (e) => e.properties.elevation,
      getFillColor: (e) => [48, 128, e.properties.elevation * 10, 255]
    }]);
  }
  ScatterplotLayer() {
    const r = sdk.network.getJunctions().map((e) => ({
      type: "Feature",
      geometry: e.geometry,
      properties: { elevation: e.elevation }
    }));
    sdk.map.addOverlay([{
      id: "ScatterplotLayer",
      type: "ScatterplotLayer",
      data: r,
      stroked: !0,
      getPosition: (e) => {
        const t = e.geometry.coordinates;
        return [t[0], t[1], e.properties.elevation];
      },
      getRadius: () => 2,
      getFillColor: [255, 140, 0],
      getLineColor: [0, 0, 0],
      getLineWidth: 2,
      radiusScale: 6,
      pickable: !0
    }]);
  }
  PointCloudLayer() {
    const r = sdk.network.getJunctions().map((e) => ({
      type: "Feature",
      geometry: e.geometry,
      properties: { elevation: e.elevation }
    }));
    sdk.map.addOverlay([{
      id: "PointCloudLayer",
      type: "PointCloudLayer",
      data: r,
      getPosition: (e) => {
        const t = e.geometry.coordinates;
        return [t[0], t[1], e.properties.elevation];
      },
      getNormal: () => [1, 0, 0],
      getColor: () => [255, 0, 255, 255],
      pointSize: 4,
      coordinateOrigin: [sdk.map.getCamera().center.lng, sdk.map.getCamera().center.lat, 10]
    }]);
  }
  LineLayer() {
    const r = sdk.network.getPipes().map((e) => ({
      type: "Feature",
      geometry: e.geometry,
      properties: {}
    }));
    sdk.map.addOverlay([{
      id: "LineLayer",
      type: "LineLayer",
      data: r,
      getSourcePosition: (e) => {
        const t = e.geometry.coordinates[0];
        return [t[0], t[1], 0];
      },
      getTargetPosition: (e) => {
        const t = e.geometry.coordinates[e.geometry.coordinates.length - 1];
        return [t[0], t[1], 0];
      },
      getColor: () => [255, 0, 255, 128],
      getWidth: 12,
      pickable: !0
    }]);
  }
  IconLayer() {
    const r = sdk.network.getJunctions().map((t) => ({
      type: "Feature",
      geometry: t.geometry,
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
    sdk.map.addOverlay([{
      id: "IconLayer",
      type: "IconLayer",
      data: r,
      getIcon: () => Math.random() > 0.5 ? "hamburger" : "paella",
      getColor: () => [255, 255, 255, 255],
      getPosition: (t) => {
        const o = t.geometry.coordinates;
        return [o[0], o[1], 0];
      },
      getSize: () => 24,
      visible: !0,
      iconAtlas: "http://localhost:8888/atlas.png",
      iconMapping: e,
      billboard: !0
    }]);
  }
  ArcLayer() {
    const r = sdk.network.getPipes().map((e) => {
      var t, o;
      return {
        type: "Feature",
        geometry: e.geometry,
        properties: {
          sourcePressure: (t = sdk.network.getNeighborAssets(e.id)[0].simulation) == null ? void 0 : t.pressure,
          targetPressure: (o = sdk.network.getNeighborAssets(e.id)[1].simulation) == null ? void 0 : o.pressure
        }
      };
    });
    sdk.map.addOverlay([{
      id: "ArcLayer",
      data: r,
      type: "ArcLayer",
      getSourcePosition: (e) => {
        const t = e.geometry.coordinates[0];
        return [t[0], t[1], 0];
      },
      getTargetPosition: (e) => {
        const t = e.geometry.coordinates[e.geometry.coordinates.length - 1];
        return [t[0], t[1], 0];
      },
      getHeight: 1,
      getSourceColor: (e) => [e.properties.sourcePressure * 2, 0, 255, 255],
      getTargetColor: (e) => [e.properties.targetPressure * 2, 0, 130, 255],
      getWidth: 4
    }]);
  }
}
A(new X());
