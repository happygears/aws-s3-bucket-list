## aws-s3-bucket-list
With this script you can easily display folders and files in Amazon S3 bucket
### Installation and usage


Via [bower](https://github.com/happygears/aws-s3-bucket-list/blob/master/bower.json):

```
bower install aws-s3-bucket-list --save
```

Via a public CDN:
##### cdn.rawgit.com
```html
<link crossorigin="anonymous" href="https://cdn.rawgit.com/happygears/aws-s3-bucket-list/6bb73518/dist/aws-bucket-list.css" media="all" rel="stylesheet" />
<script src="https://cdn.rawgit.com/happygears/aws-s3-bucket-list/6bb73518/dist/aws-bucket-list.min.js"></script>
```
##### jsdelivr.net
```html
<link crossorigin="anonymous" href="https://cdn.jsdelivr.net/gh/happygears/aws-s3-bucket-list@v0.1/dist/aws-bucket-list.min.css" media="all" rel="stylesheet" />
<script src="https://cdn.jsdelivr.net/gh/happygears/aws-s3-bucket-list@v0.1/dist/aws-bucket-list.min.js"></script>
```

##### Downloading Manually:
If you want the latest stable version, get js and css files from dist folder.

```html
<html>
<head>
    <title>Amazon Bucket listing</title>
    <script>
    <link href="aws-bucket-list.css" rel="stylesheet">
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
Coming soon...

### License