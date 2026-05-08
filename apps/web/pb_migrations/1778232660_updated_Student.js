/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2702104270")

  // update collection data
  unmarshal({
    "otp": {
      "enabled": true
    }
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2702104270")

  // update collection data
  unmarshal({
    "otp": {
      "enabled": false
    }
  }, collection)

  return app.save(collection)
})
