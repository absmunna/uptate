import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=c6827527"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __vite__cjsImport1_reactDom_client from "/node_modules/.vite/deps/react-dom_client.js?v=c6827527"; const createRoot = __vite__cjsImport1_reactDom_client["createRoot"];
import App from "/src/App.tsx";
import "/src/index.css";
if (typeof document !== "undefined") {
  try {
    const stored = window.localStorage.getItem("pm.theme.v1");
    const allowed = ["dark", "light", "midnight", "forest", "sunset", "deepDark", "colourful", "nakshiLight", "greenField"];
    const cls = stored && allowed.includes(stored) ? stored : "dark";
    document.documentElement.classList.add(cls);
  } catch {
    document.documentElement.classList.add("dark");
  }
}
createRoot(document.getElementById("root")).render(/* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
  fileName: "/app/applet/src/main.tsx",
  lineNumber: 18,
  columnNumber: 53
}, this));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4udHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZVJvb3QgfSBmcm9tIFwicmVhY3QtZG9tL2NsaWVudFwiO1xuaW1wb3J0IEFwcCBmcm9tIFwiLi9BcHBcIjtcbmltcG9ydCBcIi4vaW5kZXguY3NzXCI7XG5cbi8vIFRoZW1lIGlzIG5vdyBjb250cm9sbGVkIGJ5IDxUaGVtZVByb3ZpZGVyPiAocmVhZHMgbG9jYWxTdG9yYWdlKS4gV2Ugc2VlZFxuLy8gXCJkYXJrXCIgcHJlLW1vdW50IHNvIGZpcnN0IHBhaW50IGlzbid0IGEgZmxhc2ggb2YgdW5zdHlsZWQgbGlnaHQuXG5pZiAodHlwZW9mIGRvY3VtZW50ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gIHRyeSB7XG4gICAgY29uc3Qgc3RvcmVkID0gd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKFwicG0udGhlbWUudjFcIik7XG4gICAgY29uc3QgYWxsb3dlZCA9IFtcImRhcmtcIiwgXCJsaWdodFwiLCBcIm1pZG5pZ2h0XCIsIFwiZm9yZXN0XCIsIFwic3Vuc2V0XCIsIFwiZGVlcERhcmtcIiwgXCJjb2xvdXJmdWxcIiwgXCJuYWtzaGlMaWdodFwiLCBcImdyZWVuRmllbGRcIl07XG4gICAgY29uc3QgY2xzID0gc3RvcmVkICYmIGFsbG93ZWQuaW5jbHVkZXMoc3RvcmVkKSA/IHN0b3JlZCA6IFwiZGFya1wiO1xuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKGNscyk7XG4gIH0gY2F0Y2gge1xuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZGFya1wiKTtcbiAgfVxufVxuXG5jcmVhdGVSb290KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdFwiKSEpLnJlbmRlcig8QXBwIC8+KTtcbiJdLCJtYXBwaW5ncyI6IkFBaUJvRDtBQWpCcEQsU0FBUyxrQkFBa0I7QUFDM0IsT0FBTyxTQUFTO0FBQ2hCLE9BQU87QUFJUCxJQUFJLE9BQU8sYUFBYSxhQUFhO0FBQ25DLE1BQUk7QUFDRixVQUFNLFNBQVMsT0FBTyxhQUFhLFFBQVEsYUFBYTtBQUN4RCxVQUFNLFVBQVUsQ0FBQyxRQUFRLFNBQVMsWUFBWSxVQUFVLFVBQVUsWUFBWSxhQUFhLGVBQWUsWUFBWTtBQUN0SCxVQUFNLE1BQU0sVUFBVSxRQUFRLFNBQVMsTUFBTSxJQUFJLFNBQVM7QUFDMUQsYUFBUyxnQkFBZ0IsVUFBVSxJQUFJLEdBQUc7QUFBQSxFQUM1QyxRQUFRO0FBQ04sYUFBUyxnQkFBZ0IsVUFBVSxJQUFJLE1BQU07QUFBQSxFQUMvQztBQUNGO0FBRUEsV0FBVyxTQUFTLGVBQWUsTUFBTSxDQUFFLEVBQUUsT0FBTyx1QkFBQyxTQUFEO0FBQUE7QUFBQTtBQUFBO0FBQUEsT0FBSyxDQUFFOyIsIm5hbWVzIjpbXX0=