module.exports = {
    'default': {
        filename: 'default.png',
        textConfig: {
            title: {
                left: 100,
                top: 100,
                width: 800,
                fontSize: 60,
                fontFamily: 'Arial, sans-serif',
                color: '#ffffff'
            },
            body: {
                left: 100,
                top: 200,
                width: 800,
                fontSize: 40,
                fontFamily: 'Arial, sans-serif',
                color: '#eeeeee'
            }
        }
    },
    'novo-template': {
        filename: 'meu_template.jpg',
        textConfig: {
            title: {
                left: 50,
                top: 50,
                width: 900,
                fontSize: 80,
                fontFamily: 'Verdana, sans-serif',
                color: '#000000'
            },
            body: {
                left: 50,
                top: 150,
                width: 900,
                fontSize: 40,
                fontFamily: 'Courier New, monospace',
                color: '#333333'
            }
        }
    },
    'nutrition-feed': {
        filename: 'exemplo_modelo.jpg', // Default background if no URL provided
        textConfig: {
            title: {
                left: 50,
                top: 400,
                width: 980, // 1080 - 50 - 50 (margins)
                fontSize: 190,
                fontFamily: 'Bebas Neue, sans-serif',
                color: '#6c6c6c',
                stroke: '#000000',
                strokeWidth: 0,
                letterSpacing: 0
            },
            body: {
                left: 50,
                top: 500,
                width: 980,
                fontSize: 105,
                fontFamily: 'Bebas Neue, sans-serif',
                color: '#9f9f9f',
                stroke: '#000000',
                strokeWidth: 0,
                letterSpacing: 0
            }
        }
    }
};
