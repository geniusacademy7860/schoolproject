/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_241999722")

  // update collection data
  unmarshal({
    "name": "Attendace"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_241999722")

  // update collection data
  unmarshal({
    "name": "attendece"
  }, collection)

  return app.save(collection)
})
