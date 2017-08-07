var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack', {
    logging: false
});

var Page = db.define('page', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    urlTitle: {
        type: Sequelize.STRING,
        allowNull: false
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM('open', 'closed')
    },
    date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
        set: function (tags) {

            tags = tags || [];

            if (typeof tags === 'string') {
                tags = tags.split(',').map(function (str) {
                    return str.trim();
                });
            }

            this.setDataValue('tags', tags);

        }
    }
}, {
    hooks: {
        beforeValidate: (page) => {
            console.log(page.title);
            if (page.title) {
                // Removes all non-alphanumeric characters from title
                // And make whitespace underscore

                page.urlTitle = page.title.replace(/\s+/g, '_').replace(/\W/g, '');
                return page.urlTitle;
            } else {
                // Generates random 5 letter string
                return page.urlTitle = Math.random().toString(36).substring(2, 7);
            }
        }
    },
    getterMethods: {
        route: function() {
            return '/wiki/' + this.urlTitle;
        }
    }


});

Page.findByTag = function(someTag){
        return this.findAll({
            where : {
                tags: {
                    $contains: [someTag],
                }
            }
        });
};
Page.prototype.findSimilar = function () {
        console.log(this.tags);
        var pages = Page.findAll({
            where:{
                id:{$ne: this.id},
                tags:{$overlap:this.tags}
            }
        });
        return pages;
};


var User = db.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    }
});

Page.belongsTo(User, { as: 'author' });

module.exports = {
    db: db,
    Page: Page,
    User: User
};