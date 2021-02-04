<template>
    <div class="card">
        <div class="title">
            <span></span>
            <span>{{ title }}</span>
            <i class="el-icon-close" @click="close"></i>
        </div>
        <div class="qrcode">
            <img v-if="showType == 'H5'" src="@/assets/images/H5.png" alt="">
            <img v-if="showType == 'App'" src="@/assets/images/qrcode.png" alt="">
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: () => '扫码进入H5移动端'
        },
        showType: {
            type: String,
            default: () => ''
        }
    },
    methods: {
        close(){
            this.$emit('close')
        }
    }
}
</script>

<style scoped lang='less'>
.card {
    width: 100%;
    height: 100%;
    border-radius: 5px;

    .title {
        color: #fff;
        text-align: center;
        width: 100%;
        height: 50px;
        line-height: 50px;
        font-size: 18px;
        background-color: #054592;
        border-radius: 15px 15px 0 0;
        display: flex;
        justify-content: space-between;
        padding: 0 10px;
        box-sizing: border-box;

        i {
            line-height: 50px;
            cursor: pointer;
        }
    }

    .qrcode {
        width: 100%;
        height: calc(100% - 50px);
        display: flex;
        justify-content: center;
        align-items: center;

        & > img {
            width: 200px;
            height: 200px;
        }
    }
}
</style>