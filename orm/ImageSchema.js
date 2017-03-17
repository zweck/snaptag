export const ImageSchema = {
  name: 'Image',
  primaryKey: 'uri',
  properties: {
    uri:  'string',
    tags: { type: 'list', objectType: 'Tag' }
  }
};