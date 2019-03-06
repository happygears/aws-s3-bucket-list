## aws-s3-bucket-list
With this script you can easily display folders and files in Amazon S3 bucket
### Installation and usage


Via [bower](https://github.com/happygears/aws-s3-bucket-list/blob/master/bower.json):

```
bower install aws-s3-bucket-list --save
```
Via a public CDN:

##### jsdelivr.net
```html
<link crossorigin="anonymous" href="https://cdn.jsdelivr.net/gh/happygears/aws-s3-bucket-list@v0.2/dist/aws-bucket-list.min.css" media="all" rel="stylesheet" />
<script crossorigin="anonymous" src="https://cdn.jsdelivr.net/gh/happygears/aws-s3-bucket-list@v0.2/dist/aws-bucket-list.min.js"></script>
```

##### Downloading Manually:
If you want the latest stable version, get js and css files from dist folder.

```html
<html>
<head>
    <title>Amazon Bucket listing</title>
    <script>
    <link href="aws-bucket-list.min.css" rel="stylesheet">
    <script type="text/javascript" src="aws-bucket-list.min.js"></script>
        window.appConfig = {
            // debugUrl: location.origin + '/data.xml',
            appId: 'bucket_list',
            columns: {
                size: true,
                lastmod: true
            }, //default visible columns set false for hide column
            defaultOpenedLevel: 1, // This value is default
            rootFolderName: false, // set false to prevent rendering domain name as rootFolder
            footerText: false, //set this option to false for hide or remove for default text
            exclude: [
                /^index.html$/i,
                /\/[-].*$/
            ]
        };
    </script>
</head>
<body>
    <div id="bucket_list"></div>
</body>
</html>
```

### Development
npm install
Install dependencies first, then run one of the following commands to build the project.
npm run serve
npm run build:development 
npm run build:production
