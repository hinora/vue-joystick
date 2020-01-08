<template>
    <div style="-webkit-user-select: none;">
        <canvas :id="idCanvas"></canvas>
        <div>lenth:{{ this.lastLengthTouch }}</div>
    </div>
</template>
<script>
export default {
    props: {
        width: {
            type: Number,
            default: window.innerWidth / 3
        },
        height: {
            type: Number,
            default: window.innerHeight
        },
        ratioButton: {
            type: Number,
            default: 0.2
        },
        internalFillColor: {
            type: String,
            default: "#00AA00"
        },
        internalLineWidth: {
            type: Number,
            default: 1
        },
        internalStrokeColor: {
            type: String,
            default: "#003300"
        },
        externalLineWidth: {
            type: Number,
            default: 4
        },
        externalStrokeColor: {
            type: String,
            default: "#008000"
        }
    },
    data: function() {
        return {
            idCanvas: "canvas-" + this._uid,
            canvas: null,
            context: null,

            pressed: false,
            circumference: 2 * Math.PI,
            internalRadius: 0,
            maxMoveStickX: 0,
            maxMoveStickY: 0,
            externalRadius: 0,
            centerX: 0,
            centerY: 0,
            movedX: 0,
            movedY: 0,
            movePressX: 0,
            movePressY: 0,

            touchNumber: -1,
            lastLengthTouch: 0
        };
    },
    mounted() {
        this.canvas = document.getElementById(this.idCanvas);
        this.context = this.canvas.getContext("2d");
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.initData();
        this.initEventCanvas();
    },
    methods: {
        initData() {
            this.internalRadius = this.width * this.ratioButton;
            this.maxMoveStickX = this.width / 2 - this.internalRadius - 5;
            this.maxMoveStickY = this.height / 2 - this.internalRadius - 5;
            this.externalRadius = this.internalRadius + 30;

            this.centerX = this.width / 2;
            this.centerY = this.height / 2;

            this.movedX = this.centerX;
            this.movedY = this.centerY;

            this.drawExternal();
            this.drawInternal();
        },
        initEventCanvas() {
            if ("ontouchstart" in document.documentElement) {
                this.canvas.addEventListener(
                    "touchstart",
                    this.onTouchStart,
                    false
                );
                this.canvas.addEventListener(
                    "touchmove",
                    this.onTouchMove,
                    false
                );
                this.canvas.addEventListener(
                    "touchend",
                    this.onTouchEnd,
                    false
                );
            } else {
                this.canvas.addEventListener(
                    "mousedown",
                    this.onMouseDown,
                    false
                );
                this.canvas.addEventListener(
                    "mousemove",
                    this.onMouseMove,
                    false
                );
                this.canvas.addEventListener("mouseup", this.onMouseUp, false);
            }
        },

        /**
         * @description Bind to parent event move
         */
        move() {
            let x = (
                100 *
                ((this.movedX - this.centerX) / this.maxMoveStickX)
            ).toFixed();
            let y = (
                100 *
                ((this.movedY - this.centerY) / this.maxMoveStickY) *
                -1
            ).toFixed();
            this.$emit("move", x, y);
        },
        /**
         * @description Events for manager touch
         */
        onTouchStart(event) {
            this.movePressX = event.pageX - this.canvas.offsetLeft;
            this.movePressY = event.pageY - this.canvas.offsetTop;
            this.pressed = true;

            this.touchNumber = event.touches.length - 1;
            this.lastLengthTouch = event.touches.length;
        },
        onTouchMove(event) {
            // Prevent the browser from doing its default thing (scroll, zoom)
            event.preventDefault();
            if (this.pressed && this.touchNumber != -1) {
                if (this.lastLengthTouch < event.touches.length) {
                    this.touchNumber = event.touches.length - 1;
                    this.lastLengthTouch = event.touches.length;
                } else if (this.lastLengthTouch > event.touches.length) {
                    this.touchNumber = event.touches.length - 1;
                    this.lastLengthTouch = event.touches.length;
                }

                let moveVectorX =
                    event.touches[this.touchNumber].pageX -
                    this.canvas.offsetLeft -
                    this.movePressX;
                let moveVectorY =
                    event.touches[this.touchNumber].pageY -
                    this.canvas.offsetTop -
                    this.movePressY;

                this.movedX = this.centerX + moveVectorX;
                this.movedY = this.centerY + moveVectorY;

                // Delete canvas
                this.context.clearRect(
                    0,
                    0,
                    this.canvas.width,
                    this.canvas.height
                );
                // Redraw object
                this.drawExternal();
                this.drawInternal();
                this.move();
            }
        },
        onTouchEnd(event) {
            this.pressed = false;
            // Reset position store variable
            this.movedX = this.centerX;
            this.movedY = this.centerY;
            // Delete canvas
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            // Redraw object
            this.drawExternal();
            this.drawInternal();
            this.move();
            //canvas.unbind('touchmove');

            this.touchNumber = -1;
            this.lastLengthTouch = 0;
        },

        /**
         * @description events for manager mouse
         */
        onMouseDown(event) {
            this.movePressX = event.pageX - this.canvas.offsetLeft;
            this.movePressY = event.pageY - this.canvas.offsetTop;
            this.pressed = true;
        },
        onMouseMove(event) {
            if (this.pressed) {
                // overide here
                let moveVectorX =
                    event.pageX - this.canvas.offsetLeft - this.movePressX;
                let moveVectorY =
                    event.pageY - this.canvas.offsetTop - this.movePressY;
                this.movedX = this.centerX + moveVectorX;
                this.movedY = this.centerY + moveVectorY;
                // Delete canvas
                this.context.clearRect(
                    0,
                    0,
                    this.canvas.width,
                    this.canvas.height
                );
                // Redraw object
                this.drawExternal();
                this.drawInternal();
                this.move();
            }
        },
        onMouseUp(event) {
            this.pressed = false;
            // Reset position store variable
            this.movedX = this.centerX;
            this.movedY = this.centerY;
            // Delete canvas
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            // Redraw object
            this.drawExternal();
            this.drawInternal();
            this.move();
            //canvas.unbind('mousemove');
        },

        drawExternal() {
            this.context.beginPath();
            this.context.arc(
                this.centerX,
                this.centerY,
                this.externalRadius,
                0,
                this.circumference,
                false
            );
            this.context.lineWidth = this.externalLineWidth;
            this.context.strokeStyle = this.externalStrokeColor;
            this.context.stroke();
        },
        drawInternal() {
            this.context.beginPath();
            if (
                this.centerX - this.movedX + this.internalRadius >
                this.canvas.width / 2
            ) {
                this.movedX = this.centerX - this.maxMoveStickX;
            }
            if (
                this.movedX - this.centerX + this.internalRadius >
                this.canvas.width / 2
            ) {
                this.movedX = this.centerX + this.maxMoveStickX;
            }

            if (
                this.centerY - this.movedY + this.internalRadius >
                this.canvas.height / 2
            ) {
                this.movedY = this.centerY - this.maxMoveStickY;
            }
            if (
                this.movedY - this.centerY + this.internalRadius >
                this.canvas.height / 2
            ) {
                this.movedY = this.centerY + this.maxMoveStickY;
            }

            this.context.arc(
                this.movedX ? this.movedX : this.centerX,
                this.movedY ? this.movedY : this.centerY,
                this.internalRadius,
                0,
                this.circumference,
                false
            );
            // create radial gradient
            let grd = this.context.createRadialGradient(
                this.centerX,
                this.centerY,
                5,
                this.centerX,
                this.centerY,
                this.canvas.width / 3
            );
            // Light color
            grd.addColorStop(0, this.internalFillColor);
            // Dark color
            grd.addColorStop(1, this.internalStrokeColor);
            this.context.fillStyle = grd;
            this.context.fill();
            this.context.lineWidth = this.internalLineWidth;
            this.context.strokeStyle = this.internalStrokeColor;
            this.context.stroke();
        }
    }
};
</script>
