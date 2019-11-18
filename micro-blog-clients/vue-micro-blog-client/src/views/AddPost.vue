<template>
  <div>
    <div style="text-align: left; width:800px; margin:0 auto;">
      <strong>Title</strong>
    </div>
    <div style="text-align: center; width:800px; margin:0 auto;">
      <input style="width:800px" type="text" id="title"  name="title" value="" v-model="title" />
    </div>
    <br />
    <div style="text-align: left; width:800px; margin:0 auto;">
      <strong>Author</strong>
    </div>
    <div style="text-align: center; width:800px; margin:0 auto;">
      <input style="width:800px" type="text" name="author" v-model="author" />
    </div>
    <br />
    <div style="text-align: left; width:800px; margin:0 auto;">
      <strong>Description</strong>
    </div>
    <div style="text-align: center; width:800px; margin:0 auto;">
      <textarea
        style="height:200px; width:800px"
        name="description"
        v-model="description"
      ></textarea>
    </div>
    <br />
    <div style="text-align: right; width:800px; margin:0 auto;">
      <button id="btnSave" @click="createPost(title, description, author,createDate)">
        Save
      </button>
      <button id="btnCancel" @click="clean()">Cancel</button>
    </div>
    <br />
  </div>
</template>
<script>
//tag of graphql to make new queries and mutations
import gql from "graphql-tag";
//we are using moment to format date
import moment from "moment";

export default {
  name: "AddPost",
  data() {
    return {
      id: null,
      title: "",
      description: "",
      author: "",
      createDate: ""
    };
  },
  methods: {
    //method to call by save button to add new post
    createPost(title, description, author,createDate) {   
      createDate = moment(new Date()).format("DD-MM-YYYY");
      //call object apollo to mutate the mutation createPost defined in the graphql api
      this.$apollo.mutate({
        mutation: gql`
          mutation createPost(
            $title: String!
            $description: String!
            $createDate: String!
            $author: String!
          ) {
            createPost(
              title: $title
              description: $description
              createDate: $createDate
              author: $author
            ) {
              id,
              title,
              description,
              createDate,
              author
            }
          }
        `,
        variables: {
          title: title,
          description: description,
          createDate: createDate,
          author: author
        }
      });
      this.clean();
    },
    clean() {
      this.title = "";
      this.description = "";
      this.createdDate = "";
      this.author = "";
      this.createDate = "";
    }
  }
};
</script>
