var rawData = []
export default {
  fakeServerSideClustering (
    clusterRatio,
    maxSingleFlareCount,
    areaDisplayMode,
    map,
    Extent,
    SpatialReference,
    geometry,
    ScreenPoint
  ) {
    var itcount = 0
    console.warn('fake-server-side-cluster')

    var webExtent = map.extent

    // set up a grid system to do the clustering

    // get the total amount of grid spaces based on the height and width of the map (divide it by clusterRatio) - then get the degrees for x and y
    var xCount = Math.round(map.width / clusterRatio)
    var yCount = Math.round(map.height / clusterRatio)

    var xw = (webExtent.xmax - webExtent.xmin) / xCount
    var yh = (webExtent.ymax - webExtent.ymin) / yCount

    var gsxmin, gsxmax, gsymin, gsymax
    var dataLength = rawData.length

    // create an array of clusters that is a grid over the visible extent. Each cluster contains the extent (in web merc) that bounds the grid space for it.
    var clusters = []
    for (var i = 0; i < xCount; i++) {
      gsxmin = webExtent.xmin + xw * i
      gsxmax = gsxmin + xw
      for (var j = 0; j < yCount; j++) {
        gsymin = webExtent.ymin + yh * j
        gsymax = gsymin + yh
        var ext = new Extent({
          xmin: gsxmin,
          xmax: gsxmax,
          ymin: gsymin,
          ymax: gsymax
        })
        ext.setSpatialReference(new SpatialReference({ wkid: 102100 }))
        clusters.push({
          extent: ext,
          clusterCount: 0,
          subTypeCounts: [],
          singles: [],
          points: []
        })
      }
    }

    var web, obj
    for (let i = 0; i < dataLength; i++) {
      obj = rawData[i]
      // get a web merc lng/lat for extent checking. Use web merc as it's flat to cater for longitude pole
      web = new ScreenPoint(obj.x, obj.y)

      // filter by visible extent first
      if (
        web[0] < webExtent.xmin ||
        web[0] > webExtent.xmax ||
        web[1] < webExtent.ymin ||
        web[1] > webExtent.ymax
      ) {
        continue
      }

      var foundCluster = false
      // loop cluster grid to see if it should be added to one
      for (let j = 0, jLen = clusters.length; j < jLen; j++) {
        var cl = clusters[j]

        if (
          web[0] < cl.extent.xmin ||
          web[0] > cl.extent.xmax ||
          web[1] < cl.extent.ymin ||
          web[1] > cl.extent.ymax
        ) {
          continue // not here so carry on
        }

        // recalc the x and y of the cluster by averaging the points again
        cl.x =
          cl.clusterCount > 0 ? (obj.x + cl.x * cl.clusterCount) / (cl.clusterCount + 1) : obj.x
        cl.y =
          cl.clusterCount > 0 ? (obj.y + cl.y * cl.clusterCount) / (cl.clusterCount + 1) : obj.y

        // push every point into the cluster so we have it for area checking if required. This could be omitted if never checking areas, or on demand at least
        if (areaDisplayMode) {
          cl.points.push([obj.x, obj.y])
        }

        cl.clusterCount++

        var subTypeExists = false
        for (var s = 0, sLen = cl.subTypeCounts.length; s < sLen; s++) {
          if (cl.subTypeCounts[s].name === obj.facilityType) {
            cl.subTypeCounts[s].count++
            subTypeExists = true
            break
          }
        }
        if (!subTypeExists) {
          cl.subTypeCounts.push({ name: obj.facilityType, count: 1 })
        }

        cl.singles.push(obj)
      }
    }

    var results = []
    // for every cluster that only has one point, just add the actual object to the result
    for (let i = 0, len = clusters.length; i < len; i++) {
      if (clusters[i].clusterCount === 1) {
        results.push(clusters[i].singles[0])
      } else if (clusters[i].clusterCount > 0) {
        if (clusters[i].singles.length > maxSingleFlareCount) {
          clusters[i].singles = []
        }
        results.push(clusters[i])
      }
    }

    console.warn('fake-server-side-cluster')
    return results
  },
  getData () {
    return rawData
  },
  setData (data) {
    rawData = data
  }
}
