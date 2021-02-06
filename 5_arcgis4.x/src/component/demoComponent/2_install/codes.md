```jsx
npm install esri-loader
```

---


```jsx
var apiURL="http://ip:port/arcgis_js_api/library/4.7/dojo"
```

---

```jsx
<link rel="stylesheet" href="http://ip:port/arcgis_js_api/library/4.7/esri/css/main.css">
```

---


```jsx
const mapOption = {
  url: 'http://ip:port/arcgis_js_api/library/4.7/init.js'
}
esriLoader
  .loadModules([
    'esri/map'
  ], mapOption)
  .then(([map]) => {})
```

---

```jsx
<script>
  var dojoConfig = {
    parseOnLoad: true,
    //isDebug: true,
    locale: 'zh-cn',
    //serverIp: window.location.host + "/arcgis_js_api/library/3.16/3.16/",
    packages: [
      {
        name: 'widgets',
        location: 'http://ip:port/arcgis_js_api/library/4.7/pertools'
      }
    ]
  }
</script>
```
