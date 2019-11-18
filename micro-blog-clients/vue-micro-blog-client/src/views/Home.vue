<template>
  <div>
    <div v-for="post in Posts" :key="post.id">
      <div style="font-size: 20px; font-weight: 700;">{{ post.title }}</div>
      <div style="text-align: justify; width:800px; margin:0 auto;">
        <p>
          {{ post.description }}
        </p>
      </div>
      <div style="text-align: right; width:800px; margin:0 auto;">
        {{ post.author }}
      </div>
      <div style="text-align: right; width:800px; margin:0 auto;">
        {{ formatDate(post.createDate) }}
      </div>
    </div>
  </div>
</template>

<script>
//tag of graphql to make new queries and mutations
import gql from "graphql-tag";
//we are using moment to format date
import moment from "moment";

export default {
  name: "home",
  data() {
    return {
      id: null,
      title: String,
      description: String,
      createDate: String,
      author: String
    };
  },
  //define apollo object to make a select query
  apollo: {
    Posts: gql`
      query {
        Posts {
          id
          title
          description
          createDate
          author
        }
      }
    `
  },
  methods: {
    //method to format date
    formatDate: function(date) {
      return moment(date, "DD-MM-YYYY").format("MMM/DD/YYYY");
    }
  }
};
</script>
