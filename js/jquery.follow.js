(function ($, document, window) {
    var DraggableElement = (function () {
        function DraggableElement(element, mouseX, mouseY) {
            var elementСoordinates = element.getBoundingClientRect();

            this.draggable = true;
            this.element = $(element);
            this.x = mouseX - elementСoordinates.left;
            this.y = mouseY - elementСoordinates.top;

            this.initialize();
            this.move(mouseX, mouseY);
        }

        DraggableElement.prototype.initialize = function () {
            this.element.css("position", "fixed");
        };

        DraggableElement.prototype.move = function (mouseX, mouseY) {
            if (!this.draggable) return;

            var x = mouseX - this.x;
            var y = mouseY - this.y;

            this.element.css({
                "left": x + "px",
                "top": y + "px"
            });
        };

        DraggableElement.prototype.destroy = function (mouseX, mouseY) {
            var elementСoordinates = this.element[0].getBoundingClientRect();

            this.draggable = false;
            this.element.css({
                "position": "absolute",
                "top": this.element.css("top") + window.pageYOffset + "px"
            });

            if (
                mouseX !== undefined &&
                mouseY !== undefined &&
                mouseX >= elementСoordinates.left &&
                mouseX <= elementСoordinates.right &&
                mouseY >= elementСoordinates.top &&
                mouseY <= elementСoordinates.bottom
            ) {
                this.element.one("mouseout.follow", $.proxy(this.__cleanup, this));
            } else {
                this.__cleanup();
            }
        };

        DraggableElement.prototype.__cleanup = function () {
            this.draggable = null;
            this.element = null;
            this.x = null;
            this.y = null;

            this.onDestroy.call(this);
        };

        DraggableElement.prototype.onDestroy = function () {
        };

        return DraggableElement;
    }());

    var DraggableManager = (function () {
        var __instance = null;
        var __element = null;
        //var __elements = [];

        function followMouseMove(event) {
            __element && __element.move(event.clientX, event.clientY);
        }

        function followMouseClick(event) {
            __element && __element.destroy(event.clientX, event.clientY);
        }

        function followItemBind(event) {
            if (__element === null) {
                __element = new DraggableElement(event.target, event.clientX, event.clientY);
                __element.onDestroy = function () {
                    __element = null;
                };
            }
        }

        function DraggableManager() {
            if (__instance) return __instance;

            __instance = this;

            $(document).on({
                "mousemove.follow": followMouseMove,
                "click.follow": followMouseClick
            });
        }

        DraggableManager.prototype.add = function ($items) {
            $items.on("mouseenter.follow", followItemBind);
            //__elements.push($items);
        };

        DraggableManager.prototype.destroy = function () {
            $(document).off("mousemove.follow click.follow");
            __element && __element.destroy();
            //__elements.off("mouseenter.follow");
        };

        return DraggableManager;
    }());

    $.fn.follow = function () {
        var __draggableManager = new DraggableManager();

        __draggableManager.add(this);

        return this;
    };
})(jQuery, document, window);
