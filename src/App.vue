<template>
    <div class="controller-pad">
        <SquareButton
            style="border:1px solid red"
            @move="moveSquare"
            :width="width"
            :height="height"
        ></SquareButton>
        <button>AS</button>
        <CircleButton
            style="border:1px solid red"
            @move="move"
            :width="width"
            :height="height"
        >
        </CircleButton>
    </div>
</template>
<script>
import CircleButton from "./components/CircleButton";
import SquareButton from "./components/SquareButton";
export default {
    name: "vue-joystick",
    components: {
        CircleButton,
        SquareButton
    },
    data:function(){
        return{
            width:window.innerWidth/3,
            height:window.innerWidth/3,
        }
    },
    methods: {
        move(x, y) {
            console.log(x, y);
        },
        moveSquare(y){
            console.log(y);
        }
    }
};
</script>
<style lang="scss">
* {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
}
.controller-pad{
    display: flex;
    justify-content: space-between;
}
</style>
