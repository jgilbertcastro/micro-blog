const graphql = require("graphql");
const  sqlite3  =  require('sqlite3').verbose();

const database = new sqlite3.Database("../micro-blog.db");

const createPostTable = () => {
    const  query  =  `
        CREATE TABLE IF NOT EXISTS posts (
        id integer PRIMARY KEY,
        title text,
        description text,
        createDate text,
        author text )`;

    return  database.run(query);
}

createPostTable();

const PostType = new graphql.GraphQLObjectType({
    name: "Post",
    fields: {
        id: { type: graphql.GraphQLID },
        title: { type: graphql.GraphQLString },
        description: { type: graphql.GraphQLString },
        createDate: { type: graphql.GraphQLString },
        author: { type: graphql.GraphQLString }        
    }
});
var queryType = new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
        Posts: {
            type: graphql.GraphQLList(PostType),
            resolve: (root, args, context, info) => {
                return new Promise((resolve, reject) => {
                    
                    database.all("SELECT * FROM Posts;", function(err, rows) {  
                        if(err){
                            reject([]);
                        }
                        resolve(rows);
                    });
                });
            }
        },
        Post:{
            type: PostType,
            args:{
                id:{
                    type: new graphql.GraphQLNonNull(graphql.GraphQLID)
                }               
            },
            resolve: (root, {id}, context, info) => {
                return new Promise((resolve, reject) => {
                
                    database.all("SELECT * FROM Posts WHERE id = (?);",[id], function(err, rows) {                           
                        if(err){
                            reject(null);
                        }
                        resolve(rows[0]);
                    });
                });
            }
        }
    }
});

var mutationType = new graphql.GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createPost: {
        type: PostType,
        args: {
          title: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLString)
          },
          description:{
              type: new graphql.GraphQLNonNull(graphql.GraphQLString)
          },
          createDate:{
              type: new graphql.GraphQLNonNull(graphql.GraphQLString)
          },
          author:{
              type: new graphql.GraphQLNonNull(graphql.GraphQLString)
          }
        },
        resolve: (root, {title, description, createDate, author}) => {
            return new Promise((resolve, reject) => {
                database.run('INSERT INTO Posts (title, description, createDate, author) VALUES (?,?,?,?);', [title, description, createDate, author], (err) => {
                    if(err) {
                        reject(null);
                    }
                    database.get("SELECT last_insert_rowid() as id", (err, row) => {
                        
                        resolve({
                            id: row["id"],
                            title: title,
                            description: description,
                            createDate:createDate,
                            author: author
                        });
                    });
                });
            })
        }
      },
      updatePost: {
        type: graphql.GraphQLString,
        args:{
            id:{
                type: new graphql.GraphQLNonNull(graphql.GraphQLID)
            },
            title: {
                type: new graphql.GraphQLNonNull(graphql.GraphQLString)
            },
            description:{
                  type: new graphql.GraphQLNonNull(graphql.GraphQLString)
            },
            createDate:{
                  type: new graphql.GraphQLNonNull(graphql.GraphQLString)
            },
            author:{
                  type: new graphql.GraphQLNonNull(graphql.GraphQLString)
            }             
        },
        resolve: (root, {id, title, description, createDate, author}) => {
            return new Promise((resolve, reject) => {
                database.run('UPDATE Posts SET title = (?), description = (?), createDate = (?), author = (?) WHERE id = (?);', [title, description, createDate, author, id], (err) => {
                    if(err) {
                        reject(err);
                    }
                    resolve(`Post #${id} updated`);
                });
            })
        }
      },
      deletePost: {
        type: graphql.GraphQLString,
        args:{
            id:{
                type: new graphql.GraphQLNonNull(graphql.GraphQLID)
            }               
        },
        resolve: (root, {id}) => {
            return new Promise((resolve, reject) => {
                database.run('DELETE from Posts WHERE id =(?);', [id], (err) => {
                    if(err) {
                        reject(err);
                    }
                    resolve(`Post #${id} deleted`);                    
                });
            })
        }
      }
    }
});

const schema = new graphql.GraphQLSchema({
    query: queryType,
    mutation: mutationType 
});

module.exports = {
    schema
}