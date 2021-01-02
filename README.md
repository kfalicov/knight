# phaser-parcel

A lightweight starter kit for a Phaser game, bundled with Parcel

## installation

1. Clone this template
2. Change the name/author of the project in the package.json
3. run `npm install`
4. run `npm start` to spin up a hot-reloading local server for your project.
5. All set!

## notes

Due to how Parcel handles bundling of static files, in order to get images and other assets working as intended, the import syntax is
`import image from "url:../assets/.../image.png"`. The Loader scene included in this template has an example of this.

## resources

Phaser: [docs](https://photonstorm.github.io/phaser3-docs/) | [github](https://github.com/photonstorm/phaser)  
Parcel v2: [docs](https://v2.parceljs.org/)
