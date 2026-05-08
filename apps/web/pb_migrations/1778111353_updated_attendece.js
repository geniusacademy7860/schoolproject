/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_241999722")

  // update field
  collection.fields.addAt(4, new Field({
    "help": "",
    "hidden": false,
    "id": "select4257000983",
    "maxSelect": 1,
    "name": "Ststus",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "present",
      "Abseent"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_241999722")

  // update field
  collection.fields.addAt(4, new Field({
    "help": "",
    "hidden": false,
    "id": "select4257000983",
    "maxSelect": 1,
    "name": "present",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "present"
    ]
  }))

  return app.save(collection)
})
