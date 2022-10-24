<template>
    <div>
        <SheetList dataType="singer"></SheetList>
    </div>
</template>
<script lang="ts">
    import { defineComponent} from "vue"
    import SheetList from "@/components/SheetList.vue";
    export default  defineComponent({
        name: 'Singer',
        components: {
            SheetList,
        },

    })

</script>
