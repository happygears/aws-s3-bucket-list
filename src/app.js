  if (!location.origin) {
    location.origin = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port: '');
  }

(function() {

  function addCssClass(node, className) {
    if (!hasCssClass(node, className)) {
      const classes = node.getAttribute('class').split(/\s+/);
      classes.push(className);
      node.setAttribute('class', classes.join(' '));
    }
  }

  function removeCssClass(node, className) {
    const classes = node.getAttribute('class').split(/\s+/).filter((localName) => localName !== className);
    node.setAttribute('class', classes.join(' '));
  }

  function hasCssClass(node, className) {
    // be carefull this method does not work in some cases
    return node.getAttribute('class').indexOf(className) !== -1;
  }

  class App {
    constructor (container, url, config) {
      this._onData = this._renderToContainer;
      this._container = container;
      this._url = url;
      this._config = config;
    }

    render() {
      this._loadData();
      this._listenEvents();
    }

    _listenEvents() {
      const app = this;
      this._container.addEventListener('click', function(event) {
        const target = event.target;

        if (hasCssClass(event.target, 'node__name--folder')) {
          const folder = event.target.parentNode;
          const left = parseInt(folder.getAttribute('data-left'), 10);
          const right = parseInt(folder.getAttribute('data-right'), 10);
          
          let classMod = 'node--folder-opened';
          let addClass = false;

          if (hasCssClass(folder, classMod)) {
            removeCssClass(folder, classMod);
          } else {
            addCssClass(folder, classMod);
            addClass = true;
          }

          classMod = 'node--visible';
          app._container.querySelectorAll('.node').forEach(function (node) {
            const l = parseInt(node.getAttribute('data-left'), 10);
            const r = parseInt(node.getAttribute('data-right'), 10);
            if (left < l && right > r) {
              if (addClass) {
                addCssClass(node, classMod);
                if (hasCssClass(node, 'node--folder')) {
                  addCssClass(node, 'node--folder-opened');
                }
              } else {
                removeCssClass(node, classMod);
                removeCssClass(node, 'node--folder-opened');
              }
            }
          });

          app._highlight();
        }
      });
    }

    _highlight () {
      let visibleCounter = 0;
      this._container.querySelectorAll('.node')
        .forEach(function (node) {
          removeCssClass(node, 'node--even');
          removeCssClass(node, 'node--odd');
          if (hasCssClass(node, 'node--visible')) {
            addCssClass(node, visibleCounter++ % 2 ? 'node--even' : 'node--odd');
          }
        });
    }

    _loadData() {
      const request = new (('onload' in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest);
      const app = this;
      request.open('get', this._url);
      request.responseType = 'document';

      request.onload = function () {
        let data 
        data = App.transformXmlToJSON(this.responseXML);
        data = App.filterData(data, app._config.exclude);
        data = App.makeTree(data, app._url);
        app._data = data;
        app._onData(data);
      };

      request.send(null);
    }

    _renderToContainer () {
      const openedDefault = 10;
      const infoRows = [];
      const padding = 10;
      var counter = 0;
      this._container.innerHTML = renderFolder(this._data, 0);
      
      setTimeout(this._highlight.bind(this), 0);
      
      function renderFolder(node, folderLevel) {
        const options = {
          nodeMod: [],
          content: '',
          name: '',
          left: counter + 1,
          right: 0
        };

        counter++;

        if (folderLevel === 0) {
          options.nodeMod.push('node--root', 'node--folder-opened');
        }

        if (folderLevel <= openedDefault) {
            options.nodeMod.push('node--visible');
            
            if (node.list) {
              options.nodeMod.push('node--folder-opened');
            }
        }

        if (node.list) {
          options.name = `<span class="node__name node__name--folder"><i class="icon-folder"></i>${node.name}</span>`;
          options.nodeMod.push('node--folder');
          options.content = node.list.map((subNode) => renderFolder(subNode, folderLevel + 1)).join('');
        } else {
          options.name = `<a target="_blank" href="${encodeURI(node.url)}" 
            class="node__name node__name--file"><i class="icon-doc-inv"></i>${node.name}</a>`;
          options.nodeMod.push('node--file');
        }
        
        counter++;
        options.right = counter;

        let info = `
            <span class="node__info-value">${App.niceSize(node.size)}</span>
            <span class="node__info-value">${node.lastmod}</span>
        `;

        return `
          <div style="padding-left: ${padding * folderLevel}px" data-left="${options.left}" data-right="${options.right}" class="node${' ' + options.nodeMod.join(' ')}">
            ${options.name}${info}
          </div>
          ${options.content}`;
      }
    }

    static niceSize(size) {
      if (!/^\d+$/.test(size)) {
        return size;
      }

      let measure = 'B';

      if (size > 1024) {
        size /= 1024;
        measure = 'KB';
      }

      if (size > 1024) {
        size /= 1024;
        measure = 'MB';
      }
      
      if (measure !== 'B') {
        size = Number(size).toFixed(2);
      }

      return  size + ' ' + measure;
    }

    static makeTree(list, baseUrl = '/') {
      const isFolderRegexp = /\/$/;
      let rootFolder, targetFolder;
      
      rootFolder = {
        name: baseUrl,
        list: [],
        url : baseUrl.replace(/\/$/, ''),
        lastmod: '',
        size: ''
      };

      list.sort((a, b) => a.length < b.length ? -1 : 1);
      list.forEach(function (node) {
        let local;
        const parts = node.name.split('/').filter((chunk) => chunk != '');
        targetFolder = rootFolder;
        parts.forEach(function(chunkName, index) {
          local = targetFolder.list.find((f) => f.name === chunkName);
          if (!local) {
            const currentNode = {
              name: chunkName,
              lastmod: node.lastmod,
              url: targetFolder.url + '/' + chunkName,
              size: index + 1 === parts.length ? node.size : 0
            };

            if (index + 1 < parts.length || isFolderRegexp.test(node.name)) {
              currentNode.list = [];
            }

            targetFolder.list.push(currentNode);
            targetFolder = currentNode;
          } else {
            targetFolder = local;
          }
        });
      });

      function sortFolder (folder) {
        if (folder.list) {
          folder.list.sort(function (a, b) {
            const aList = !!a.list;
            const bList = !!b.list;
            
            if (aList !== bList) {
                return aList < bList ? 1 : -1;
            }
            
            return a.name < b.name ? -1 : 1;
          });

          folder.list.map(sortFolder);
        }

        return folder;
      }

      return sortFolder(rootFolder);
    }

    static transformXmlToJSON (xml) {
      const nodes = xml.getElementsByTagName('Contents');
      const list = [];
      
      for (let i = 0; i < nodes.length; i++) {
        list.push({
          name: nodes[i].getElementsByTagName('Key')[0].firstChild.data,
          size: nodes[i].getElementsByTagName('Size')[0].firstChild.data,
          lastmod: nodes[i].getElementsByTagName('LastModified')[0].firstChild.data
        });
      }

      return list;
    }

    static filterData(list, rules) {
      if (!rules && !rules.length) {
        return list;
      }

      return list.filter((item) => rules.reduce((result, rule) => result && !rule.test(item.name), true));
    }
  }

  addEventListener('load', function() {
    const container = document.getElementById('bucket_list');
    const config = window.appConfig;
    const url = config.debugUrl ? config.debugUrl : location.origin;
    (new App(container, url, config)).render();
  });
}());