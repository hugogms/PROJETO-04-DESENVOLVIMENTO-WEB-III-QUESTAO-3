// Carregar os módulos:
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

// Content-Types:
const contentTypes = {
    '.html': 'text/html; charset=utf-8',
    '.json': 'application/json; charset=utf-8'
};

// Abrir arquivo HTML:
function readFile(response, file) {
    fs.readFile(file, function(err, data) {
        if (err) {
            response.writeHead(404, {
                'Content-Type': 'text/html; charset=utf-8'
            });
            response.end('Erro 404 - Página não encontrada');
            return;
        }
        var extension = path.extname(file).toLowerCase();
        var contentType = contentTypes[extension] || 'text/html; charset=utf-8';
        response.writeHead(200, {
            'Content-Type': contentType
        });
        response.end(data);
    });
}

// Função Callback do servidor:
var callback = function(request, response) {
    var pathname = decodeURIComponent(
        url.parse(request.url).pathname
    );

    // Rota principal:
    if (pathname === '/') {
        return readFile(
            response,
            path.join(publicDir, 'index.html')
        );
    }

     // Rota da instituição:
    if (pathname === '/instituicao') {

        fs.readFile(
            path.join(__dirname, 'instituicao.json'),
            'utf8',
            function(err, data) {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/html; charset=utf-8'
                    });
                    response.end('Erro ao ler o arquivo JSON');
                    return;
                }
                response.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                response.end(data);
            }
        );
        return;
    }

    // Rota não encontrada:
    response.writeHead(404, {
        'Content-Type': 'text/html; charset=utf-8'
    });
    response.end('Erro 404 - Rota não encontrada');
};

// Criar e configurar o servidor:
var server = http.createServer(callback);
server.listen(3000);
console.log('Servidor iniciado em http://localhost:3000/');