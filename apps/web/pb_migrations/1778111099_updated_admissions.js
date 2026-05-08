/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1933831191")

  // update field
  collection.fields.addAt(4, new Field({
    "help": "",
    "hidden": false,
    "id": "select4122955671",
    "maxSelect": 1,
    "name": "Gender",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "male",
      "female"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1933831191")

  // update field
  collection.fields.addAt(4, new Field({
    "help": "",
    "hidden": false,
    "id": "select4122955671",
    "maxSelect": 1,
    "name": "Gender",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "Female",
      "female"
    ]
  }))

  return app.save(collection)
})
