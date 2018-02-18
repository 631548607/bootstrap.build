const testFolder = './examples-src/'
const fs = require('fs')
const ncp = require('ncp').ncp
const rimraf = require('rimraf')

rimraf('./public/preview', () => {
  fs.mkdirSync('./public/preview')
  fs.readdir(testFolder, (err, files) => {
    files.forEach(file => {
      if(fs.lstatSync(`./examples-src/${file}`).isDirectory()) {
        try {
          let indexHTML = fs.readFileSync(`./examples-src/${file}/index.html`, 'utf8')
          indexHTML = indexHTML
            .replace('../../../../assets/js/vendor/popper.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js')
            .replace('../../../../dist/js/bootstrap.min.js', 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js')
            .replace('../../../../assets/js/vendor/holder.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/holder/2.9.4/holder.min.js')
            .replace('../../../../assets/js/vendor/jquery-slim.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.slim.min.js')
            .replace('<link href="../../../../dist/css/bootstrap.min.css" rel="stylesheet">', '<style id="css"></style>')
            .replace('</body>', `
              <script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"></script>
              <script type="text/javascript">
                window.addEventListener('message', message => {
                  if(message.data.loading) {
                    document.title = '⏱ Loading...'
                  }
                  if(message.data.css) {
                    document.getElementById('css').innerHTML = message.data.css
                    document.title = '✅ Preview updated'
                  }
                  if(message.data.fonts) {
                    try {
                      WebFont.load({
                        google: {
                          families: message.data.fonts
                        }
                      })
                    } catch(err) {}
                  }
                }, false)
              </script>
              </body>
            `)
            ncp(`./examples-src/${file}`, `./public/preview/${file}`, function (err) {
             if (err) {
               return console.error(err)
             }
             console.log('Copied original!')
             fs.writeFile(`./public/preview/${file}/index.html`, indexHTML, function(err) {
                if(err) {
                  return console.log(err)
                }
                console.log("The file was updated with needed deps 👍!");
              })
            })
        } catch(err) {
          return ''
        }
      }
    })
  })
})
