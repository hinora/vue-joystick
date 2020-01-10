<template>
    <canvas :id="idCanvas"></canvas>
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
        center: {
            type: Boolean,
            default: false
        },
        holdPosition: {
            type: Boolean,
            default: true
        },
        ratioButtonX: {
            type: Number,
            default: 1
        },
        ratioButtonY: {
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

            widthSquare: 0,
            heightSquare: 0,

            maxMoveStickY: 0,
            externalRadius: 0,

            centerX: 0,
            centerY: 0,
            movedY: 0,
            movePressY: 0,
            holdPositionY: 0
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
            this.widthSquare = this.width * this.ratioButtonX;
            this.heightSquare = this.height * this.ratioButtonY;

            this.externalRadius = this.widthSquare + 30;

            this.centerX = this.width / 2;
            if (this.center) {
                this.maxMoveStickY = this.height / 2 - this.heightSquare / 2;
                this.centerY = this.height / 2;
            } else {
                this.maxMoveStickY = this.height - this.heightSquare;
                this.centerY = this.height - this.heightSquare / 2;
            }

            this.movedY = this.centerY;
            this.holdPositionY = this.centerY;
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
            let y = (
                100 *
                ((this.movedY - this.centerY) / this.maxMoveStickY) *
                -1
            ).toFixed();
            this.$emit("move", y);
        },
        /**
         * @description Events for manager touch
         */
        onTouchStart(event) {
            this.movePressY =
                event.changedTouches[0].pageY - this.canvas.offsetTop;
            this.pressed = true;
        },
        onTouchMove(event) {
            // Prevent the browser from doing its default thing (scroll, zoom)
            event.preventDefault();
            if (this.pressed) {
                let moveVectorY =
                    event.changedTouches[0].pageY -
                    this.canvas.offsetTop -
                    this.movePressY;

                if (this.holdPosition) {
                    this.movedY = this.holdPositionY + moveVectorY;
                } else {
                    this.movedY = this.centerY + moveVectorY;
                }
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
            if (!this.holdPosition) {
                this.movedY = this.centerY;
            } else {
                this.holdPositionY = this.movedY;
            }
            // Delete canvas
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            // Redraw object
            this.drawExternal();
            this.drawInternal();
            this.move();
            //canvas.unbind('touchmove');
        },

        /**
         * @description events for manager mouse
         */
        onMouseDown(event) {
            this.movePressY = event.pageY - this.canvas.offsetTop;
            this.pressed = true;
        },
        onMouseMove(event) {
            if (this.pressed) {
                // overide here

                let moveVectorY =
                    event.pageY - this.canvas.offsetTop - this.movePressY;
                if (this.holdPosition) {
                    this.movedY = this.holdPositionY + moveVectorY;
                } else {
                    this.movedY = this.centerY + moveVectorY;
                }
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
            if (!this.holdPosition) {
                this.movedY = this.centerY;
            } else {
                this.holdPositionY = this.movedY;
            }
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
            if (this.center) {
                if (
                    this.centerY - this.movedY + this.heightSquare / 2 >
                    this.canvas.height / 2
                ) {
                    this.movedY = this.centerY - this.maxMoveStickY;
                }
                if (
                    this.movedY - this.centerY + this.heightSquare / 2 >
                    this.canvas.height / 2
                ) {
                    this.movedY = this.centerY + this.maxMoveStickY;
                }
            } else {
                if (this.centerY - this.movedY > this.maxMoveStickY) {
                    this.movedY = this.centerY - this.maxMoveStickY;
                }

                if (this.movedY - this.centerY > 0) {
                    this.movedY = this.centerY;
                }
            }
            // console.log(this.movedY);
            this.context.rect(
                this.centerX - this.widthSquare / 2,
                this.movedY - this.heightSquare / 2,
                this.widthSquare,
                this.heightSquare
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
