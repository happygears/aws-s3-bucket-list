## aws-s3-bucket-list
With this script you can easily display folders and files in Amazon S3 bucket
### Installation and usage


Via [bower](https://github.com/happygears/aws-s3-bucket-list/blob/master/bower.json):

```
bower install aws-s3-bucket-list --save
```

Via npm:
Coming soon...

Via a public CDN:
##### Rawgit
```html
<link crossorigin="anonymous" href="https://cdn.rawgit.com/happygears/aws-s3-bucket-list/6bb73518/dist/aws-bucket-list.css" media="all" rel="stylesheet" />
<script src="https://cdn.rawgit.com/happygears/aws-s3-bucket-list/6bb73518/dist/aws-bucket-list.min.js"></script>
```

##### Downloading Manually:

If you want the latest stable version, get js and css files from dist folder.

### Configuration


```javascript
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
```


### Development
Coming soon...

### License