<template>
  <div class="outer">
    <h1>Popular Categories</h1>
  <div class="main">
    <div class="popular">   
      <AwCategoryCard class="first"
        label="Personal Care" 
        count="32"
        :background='{"mobile":require("../static/homepage/two-business-partners-working-office 2.png"),"desktop":require("../static/homepage/two-business-partners-working-office 2.png")}'
        link="#"
      /> 
    </div>
    <div class="popular">   
      <AwCategoryCard class="first"
        label="Personal Care" 
        count="32"
        :background='{"mobile":require("../static/homepage/two-business-partners-working-office 2.png"),"desktop":require("../static/homepage/two-business-partners-working-office 2.png")}'
        link="#"
      /> 
    </div>
    <div class="popular">   
      <AwCategoryCard class="first"
        label="Personal Care" 
        count="32"
        :background='{"mobile":require("../static/homepage/two-business-partners-working-office 2.png"),"desktop":require("../static/homepage/two-business-partners-working-office 2.png")}'
        link="#"
      /> 
    </div>
    <div class="popular">   
      <AwCategoryCard class="first"
        label="Personal Care" 
        count="32"
        :background='{"mobile":require("../static/homepage/two-business-partners-working-office 2.png"),"desktop":require("../static/homepage/two-business-partners-working-office 2.png")}'
        link="#"
      /> 
    </div>
  </div>
  </div>
</template>

<script>
import AwCategoryCard from '../node_modules/@storefront-ui/root/packages/vue/src/components/molecules/AwCategoryCard/AwCategoryCard.vue';

export default {
  name: 'PopularCategories',
  components: {
    AwCategoryCard
  },
};
</script>



<style scoped>

  *{
    box-sizing: border-box;
  }
  .outer {
    width: 100%;
  }

  h1 {
    /* outline: dotted; */
    text-align: center;
    left: 42.1%;
    right: 42.1%;
    top: 0%;
    bottom: 84.24%;
    /* font-family: 'Source Sans Pro'; */
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 32px; 

   /* display: flex; */
    color: #282828
  }

  .main {
    display: flex
  }

  .first {
    margin: 0.8rem;
  }


</style>

<style lang=scss>
  .popular {
    display: flex;
    .sf-category-card__details  {
      background: #037EE6;
    }
  }

  @media screen and (max-width: 1024px) {
    .popular {
      width: 17rem;
      height: 15rem;
      display: flex;
    }
  }

  @media screen and (max-width: 768px) {
    .popular {
      width: 14rem;
      height: 12rem;
      display: flex;
    }
  }

</style>

