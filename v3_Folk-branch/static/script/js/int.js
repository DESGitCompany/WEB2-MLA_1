//widgets
(function(global) {
    var LiteGraph = global.LiteGraph;

    /* WidgetsButton ****************/

    function WidgetButton() {
        this.addOutput("", LiteGraph.EVENT);
        this.addOutput("", "boolean");
        // this.addProperty("text" , "");
        // this.addProperty("text", "Upload");
        // this.addProperty("font_size", 30);
        // this.addProperty("message", "");
        this.size = [164, 84];
        this.clicked = false;

        this.SelectedFile;
    }

    WidgetButton.title = "Upload (File)";
    WidgetButton.desc = "Triggers an event";

    WidgetButton.font = "Arial";
    WidgetButton.prototype.onDrawForeground = function(ctx) {
        if (this.flags.collapsed) {
            return;
        }
        var margin = 10;
        ctx.fillStyle = "black";
        ctx.fillRect(
            margin + 1,
            margin + 1,
            this.size[0] - margin * 2,
            this.size[1] - margin * 2
        );
        ctx.fillStyle = "#AAF";
        ctx.fillRect(
            margin - 1,
            margin - 1,
            this.size[0] - margin * 2,
            this.size[1] - margin * 2
        );
        ctx.fillStyle = this.clicked
            ? "white"
            : this.mouseOver
            ? "#668"
            : "#334";
        ctx.fillRect(
            margin,
            margin,
            this.size[0] - margin * 2,
            this.size[1] - margin * 2
        );
            
        ctx.textAlign = "center";
        ctx.fillStyle = this.clicked ? "black" : "white";
        var font_size = 30;
        ctx.font = font_size + "px " + WidgetButton.font;
        var text_name = 'Upload';
        ctx.fillText(
            text_name,
            this.size[0] * 0.5,
            this.size[1] * 0.5 + font_size * 0.3
        );
        ctx.textAlign = "left";


        // if (this.properties.text || this.properties.text === 0) {
        //     var font_size = this.properties.font_size || 30;
        //     ctx.textAlign = "center";
        //     ctx.fillStyle = this.clicked ? "black" : "white";
        //     ctx.font = font_size + "px " + WidgetButton.font;
        //     ctx.fillText(
        //         this.properties.text,
        //         this.size[0] * 0.5,
        //         this.size[1] * 0.5 + font_size * 0.3
        //     );
        //     ctx.textAlign = "left";
        // }
    };

    WidgetButton.prototype.onMouseDown = function(e, local_pos) {
        
        if(this.clicked == true) return;
        console.log(this.clicked);

        if (
            local_pos[0] > 1 &&
            local_pos[1] > 1 &&
            local_pos[0] < this.size[0] - 2 &&
            local_pos[1] < this.size[1] - 2
        ) {
            var fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.style.display = 'none';
            document.body.appendChild(fileInput);

            fileInput.addEventListener('change', function(event) {
                var selectedFile = event.target.files[0];
                console.log('Selected file:', selectedFile);

                this.SelectedFile = selectedFile;
            });

            fileInput.click();

            setTimeout(function() {
                document.body.removeChild(fileInput);
            }, 0);


            this.clicked = true;
            this.setOutputData(1, this.clicked);
            this.triggerSlot(0, this.properties.message);
            return true;
        }
    };

    WidgetButton.prototype.onExecute = function() {
        this.setOutputData(1, this.clicked);
    };

    WidgetButton.prototype.onMouseUp = function(e) {
        //this.clicked = false;
    };

    LiteGraph.registerNodeType("UI/Upload/Upload (File)", WidgetButton);


    /* WidgetsText **********************/
    function WidgetText() {
        this.addInputs("", 0);
        this.properties = {
            value: "...",
            font: "Arial",
            fontsize: 18,
            color: "#AAA",
            align: "left",
            glowSize: 0,
            decimals: 1,
        };
        this.size = [164, 84];
        this.clicked = false;

    }

    WidgetText.title = "Prompt Txt";
    WidgetText.desc = "Shows the input value";
    WidgetText.widgets = [
        { name: "resize", text: "Resize box", type: "button" },
        { name: "led_text", text: "LED", type: "minibutton" },
        { name: "normal_text", text: "Normal", type: "minibutton" }
    ];

    WidgetText.prototype.onDrawForeground = function(ctx, a) {

        //TEXT
        ctx.fillStyle = this.properties["color"];
        var v = this.properties["value"];

        if (this.properties["glowSize"]) {
            ctx.shadowColor = this.properties.color;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = this.properties["glowSize"];
        } else {
            ctx.shadowColor = "transparent";
        }

        var fontsize = this.properties["fontsize"];

        ctx.textAlign = this.properties["align"];
        ctx.font = fontsize.toString() + "px " + this.properties["font"];
        this.str =
            typeof v == "number" ? v.toFixed(this.properties["decimals"]) : v;

        if (typeof this.str == "string") {
            var lines = this.str.replace(/[\r\n]/g, "\\n").split("\\n");
            for (var i=0; i < lines.length; i++) {
                ctx.fillText(
                    lines[i],
                    this.properties["align"] == "left" ? 15 : this.size[0] - 15,
                    fontsize * -0.15 + fontsize * (parseInt(i) + 1)
                );
            }
        }

        ctx.shadowColor = "transparent";
        this.last_ctx = ctx;
        ctx.textAlign = "left";


        // BUTTON
        var buttonWidth = 150; // Set the width of the button
        var buttonHeight = 50; // Set the height of the button
        var buttonX = this.size[0] / 2 - buttonWidth / 2; // Center the button horizontally
        var buttonY = fontsize * lines.length + 10; // Place the button below the text with some padding

        // Draw the button background
        ctx.fillStyle = "black"; // Set the button background color
        ctx.fillRect(buttonX + 1, buttonY + 1, buttonWidth, buttonHeight);

        ctx.fillStyle = "#AAF";
        ctx.fillRect(buttonX - 1, buttonY - 1, buttonWidth, buttonHeight);

        ctx.fillStyle = this.clicked
            ? "white"
            : this.mouseOver
            ? "#668"
            : "#334";
        ctx.fillRect(
            buttonX,
            buttonY,
            buttonWidth,
            buttonHeight
        );


        // Draw the button text
        ctx.fillStyle = "#ffffff"; // Set the text color
        ctx.textAlign = "center";
        ctx.fillText("Copy me!", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2 + 5);

        // Reset text alignment
        ctx.textAlign = "left";

        ctx.shadowColor = "transparent";
        this.last_ctx = ctx;

    };

    WidgetText.prototype.onMouseDown = function(e, local_pos) {
        //if(this.clicked == true) return;
        //console.log(this.clicked);

        if (
            local_pos[0] > 1 &&
            local_pos[1] > 1 &&
            local_pos[0] < this.size[0] - 2 &&
            local_pos[1] < this.size[1] - 2
        ) {
            try{
                // Use the Clipboard API to copy the text to the clipboard
                navigator.clipboard.writeText(this.properties.value)
                .then(function() {
                    alert('Copied to clipboard: ' + this.properties.value);
                    this.clicked = false;
                })
                .catch(function(err) {
                    console.log('Unable to copy to clipboard', err);
                });
            } catch (err) { console.log('Unable to copy to clipboard', err); }

            this.clicked = true;
            this.setOutputData(1, this.clicked);
            this.triggerSlot(0, this.properties.message);
            return true;
        }
    };

    WidgetText.prototype.onExecute = function() {
        var v = this.getInputData(0);
        if (v != null) {
            this.properties["value"] = v;
        }
        //this.setDirtyCanvas(true);
    };

    WidgetText.prototype.onMouseUp = function(e) {
        this.clicked = false;
    };

    WidgetText.prototype.resize = function() {
        if (!this.last_ctx) {
            return;
        }

        var lines = this.str.split("\\n");
        this.last_ctx.font =
            this.properties["fontsize"] + "px " + this.properties["font"];
        var max = 0;
        for (var i=0; i < lines.length; i++) {
            var w = this.last_ctx.measureText(lines[i]).width;
            if (max < w) {
                max = w;
            }
        }
        this.size[0] = max + 20;
        this.size[1] = 4 + lines.length * this.properties["fontsize"];

        this.setDirtyCanvas(true);
    };

    WidgetText.prototype.onPropertyChanged = function(name, value) {
        this.properties[name] = value;
        this.str = typeof value == "number" ? value.toFixed(3) : value;
        //this.resize();
        return true;
    };

    LiteGraph.registerNodeType("UI/Prompt Txt", WidgetText);



    /* Widgets(String, INT, FLOAT) **********************/
    function GraphInput() {
        this.addOutput("", "number");

        this.name_in_graph = "";
        this.properties = {
			//name: "",
			type: "number",
            number: 0,
			//value: 0
		}; 

        var that = this;

        // this.name_widget = this.addWidget(
        //     "text",
        //     "Name",
        //     this.properties.name,
        //     function(v) {
        //         if (!v) {
        //             return;
        //         }
        //         that.setProperty("name",v);
        //     }
        // );

        this.type_widget = this.addWidget(
            "text",
            "Type",
            this.properties.type,
            function(v) {
				that.setProperty("type",v);
            }
        );

        this.number_widget = this.addWidget(
            "number",
            "number",
            this.properties.number,
            function(v) {
				that.setProperty("number",v);
            }
        );

        // this.value_widget = this.addWidget(
        //     "number",
        //     "Value",
        //     this.properties.value,
        //     function(v) {
        //         that.setProperty("value",v);
        //     }
        // );
        
        this.hasExecuted = false;
        this.widgets_up = true;
        this.size = [180, 90];
    }

    GraphInput.title = "User Input (int)";
    GraphInput.desc = "User Input of the (int)";

	GraphInput.prototype.onConfigure = function() 
    {
		this.updateType();
	}

	//ensures the type in the node output and the type in the associated graph input are the same
	GraphInput.prototype.updateType = function()
	{
        //console.log('w');
		var type = this.properties.type;
		this.type_widget.value = type;

		//update output
		if(this.outputs[0].type != type)
		{
	        if (!LiteGraph.isValidConnection(this.outputs[0].type,type))
				this.disconnectOutput(0);
			this.outputs[0].type = type;
		}

		//update widget
		if(type == "number")
		{
			this.value_widget.type = "number";
			this.value_widget.value = 0;
		}
		else if(type == "boolean")
		{
			this.value_widget.type = "toggle";
			this.value_widget.value = true;
		}
		else if(type == "string")
		{
			this.value_widget.type = "text";
			this.value_widget.value = "";
		}
		else
		{
			this.value_widget.type = null;
			this.value_widget.value = null;
		}
		this.properties.value = this.value_widget.value;

		//update graph
		if (this.graph && this.name_in_graph) {
			this.graph.changeInputType(this.name_in_graph, type);
		}
	}

	//this is executed AFTER the property has changed
	GraphInput.prototype.onPropertyChanged = function(name,v)
	{
		if( name == "name" )
		{
            console.log("W1");
			if (v == "" || v == this.name_in_graph || v == "enabled") {
				return false;
			}
			if(this.graph)
			{
				if (this.name_in_graph) {
					//already added
					this.graph.renameInput( this.name_in_graph, v );
				} else {
					this.graph.addInput( v, this.properties.type );
				}
			} //what if not?!
			this.name_widget.value = v;
			this.name_in_graph = v;
		}
		else if( name == "type" )
		{
			this.updateType();
		}
		else if( name == "value" )
		{
		}
	}

    GraphInput.prototype.getTitle = function() {
        if (this.flags.collapsed) {
            return this.properties.name;
        }
        return this.title;
    };

    GraphInput.prototype.onAction = function(action, param) {
        if (this.properties.type == LiteGraph.EVENT) {
            this.triggerSlot(0, param);
        }
    };

    GraphInput.prototype.onExecute = function() {
        // var name = this.properties.name;
        // //read from global input
        // var data = this.graph.inputs[name];
        // if (!data) {
        //     this.setOutputData(0, this.properties.value );
		// 	return;
        // }

        // this.setOutputData(0, data.value !== undefined ? data.value : this.properties.value );

        if(this.hasExecuted) return;
        this.hasExecuted = true;

        var isOutput0_SET = this.isOutputConnected(0);
        if (!isOutput0_SET) return;

        var Output0_SET = this.properties.number;
        this.setOutputData(0, Output0_SET);
    };

    GraphInput.prototype.onRemoved = function() {
        if (this.name_in_graph) {
            this.graph.removeInput(this.name_in_graph);
        }
    };

    GraphInput.prototype.onStart = function (){
        this.hasExecuted = false;
    };

    LiteGraph.GraphInput = GraphInput;
    LiteGraph.registerNodeType("UI/input", GraphInput);

    /* WidgetsAdd (+) **********************/
    function MathLerp() {
        this.properties = { f: 0.5 };
        this.addInput("A", "number");
        this.addInput("B", "number");

        this.addOutput("out", "number");

        this.hasExecuted = false;
    }

    MathLerp.title = "ADD (+)";
    MathLerp.desc = "Linear Interpolation";

    MathLerp.prototype.onExecute = function() {
        // var v1 = this.getInputData(0);
        // if (v1 == null) {
        //     v1 = 0;
        // }
        // var v2 = this.getInputData(1);
        // if (v2 == null) {
        //     v2 = 0;
        // }

        // var f = this.properties.f;

        // var _f = this.getInputData(2);
        // if (_f !== undefined) {
        //     f = _f;
        // }

        // this.setOutputData(0, v1 * (1 - f) + v2 * f);

        if(this.hasExecuted) return;
        this.hasExecuted = true;

        var isA_GET = this.isInputConnected(0);
        if (!isA_GET) return;
        var isB_GET = this.isInputConnected(1);
        if (!isB_GET) return;
        
        var A_GET = this.getInputData(0);
        var B_GET = this.getInputData(1);
        console.log(A_GET);
        console.log(B_GET);

        var isOutput0_SET = this.isOutputConnected(0);
        if(!isOutput0_SET) return;


        //ADD AJAX TO PYTHON (A+B)
        //var AB_SET = A_GET + B_GET;

        //ADD JS TO PYTHON (A+B)
        var this1 = this
        const requestData = JSON.stringify({A_GET: A_GET, B_GET: B_GET});
        AJAX(requestData).then(function(response){
            var AB_SET = response.s_Output0_SET;

            console.log(AB_SET);

            this1.setOutputData(0, AB_SET);

        }).catch(function(error) {
            alert(error);
            //location.reload();
        });
        //var AB_SET = RD.s_Output0_SET;


        

        //this.setOutputData(0, AB_SET);
    };

    MathLerp.prototype.onStart = function (){
        this.hasExecuted = false;
    };

    MathLerp.prototype.onGetInputs = function() {
        return [["f", "number"]];
    };

    LiteGraph.registerNodeType("UI/ADD", MathLerp);


    /* WidgetsOutput **********************/
    function WidgetTextOutput() {
        this.addInputs("r", "number");

        this.properties = {
            value: "...",
            font: "Arial",
            fontsize: 18,
            color: "#AAA",
            align: "left",
            glowSize: 0,
            decimals: 1,
        };
        this.size = [164, 120];
        this.clicked = false;

    }

    WidgetTextOutput.title = "Output";
    WidgetTextOutput.desc = "Shows the Output value";
    WidgetTextOutput.widgets = [
        { name: "resize", text: "Resize box", type: "button" },
        { name: "led_text", text: "LED", type: "minibutton" },
        { name: "normal_text", text: "Normal", type: "minibutton" }
    ];

    WidgetTextOutput.prototype.onDrawForeground = function(ctx, a) {

        // ctx.fillStyle = "black"; // Set the button background color
        // ctx.fillRect(10 + 1, 10 + 1, 20, 20);

        //TEXT
        ctx.fillStyle = this.properties["color"];
        var v = this.properties["value"];

        if (this.properties["glowSize"]) {
            ctx.shadowColor = this.properties.color;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = this.properties["glowSize"];
        } else {
            ctx.shadowColor = "transparent";
        }

        var fontsize = this.properties["fontsize"];

        ctx.textAlign = this.properties["align"];
        ctx.font = fontsize.toString() + "px " + this.properties["font"];
        this.str =
            typeof v == "number" ? v.toFixed(this.properties["decimals"]) : v;

        if (typeof this.str == "string") {
            var lines = this.str.replace(/[\r\n]/g, "\\n").split("\\n");
            for (var i=0; i < lines.length; i++) {
                ctx.fillText(
                    lines[i],
                    this.properties["align"] == "left" ? 15 : this.size[0] - 15,
                    fontsize * -0.15 + fontsize * (parseInt(i) + 1) + 25
                );
            }
        }

        ctx.shadowColor = "transparent";
        this.last_ctx = ctx;
        ctx.textAlign = "left";

        
        // BUTTON
        var buttonWidth = 150; // Set the width of the button
        var buttonHeight = 50; // Set the height of the button
        var buttonX = this.size[0] / 2 - buttonWidth / 2; // Center the button horizontally
        var buttonY = fontsize * lines.length + 40; // Place the button below the text with some padding

        // Draw the button background
        ctx.fillStyle = "black"; // Set the button background color
        ctx.fillRect(buttonX + 1, buttonY + 1, buttonWidth, buttonHeight);

        ctx.fillStyle = "#AAF";
        ctx.fillRect(buttonX - 1, buttonY - 1, buttonWidth, buttonHeight);

        ctx.fillStyle = this.clicked
            ? "white"
            : this.mouseOver
            ? "#668"
            : "#334";
        ctx.fillRect(
            buttonX,
            buttonY,
            buttonWidth,
            buttonHeight
        );


        // Draw the button text
        ctx.fillStyle = "#ffffff"; // Set the text color
        ctx.textAlign = "center";
        ctx.fillText("Copy me!", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2 + 5);

        // Reset text alignment
        ctx.textAlign = "left";

        ctx.shadowColor = "transparent";
        this.last_ctx = ctx;

    };

    WidgetTextOutput.prototype.onMouseDown = function(e, local_pos) {
        //if(this.clicked == true) return;
        //console.log(this.clicked);

        if (
            local_pos[0] > 1 &&
            local_pos[1] > 1 &&
            local_pos[0] < this.size[0] - 2 &&
            local_pos[1] < this.size[1] - 2
        ) {
            try{
                // Use the Clipboard API to copy the text to the clipboard
                navigator.clipboard.writeText(this.properties.value)
                .then(function() {
                    alert('Copied to clipboard: ' + this.properties.value);
                    this.clicked = false;
                })
                .catch(function(err) {
                    console.log('Unable to copy to clipboard', err);
                });
            } catch (err) { console.log('Unable to copy to clipboard', err); }

            this.clicked = true;
            this.setOutputData(1, this.clicked);
            this.triggerSlot(0, this.properties.message);
            return true;
        }
    };

    WidgetTextOutput.prototype.onExecute = function() {
        // var v = this.getInputData(0);
        // if (v != null) {
        //     this.properties["value"] = v;
        // }
        // //this.setDirtyCanvas(true);

        var isRead_GET = this.isInputConnected(0);
        if (!isRead_GET) return;
        if(this.getInputData(0) === undefined) return;
        
        var Read_GET = this.getInputData(0);
        this.properties.value = Read_GET;
    };

    WidgetTextOutput.prototype.onMouseUp = function(e) {
        this.clicked = false;
    };

    WidgetTextOutput.prototype.resize = function() {
        if (!this.last_ctx) {
            return;
        }

        var lines = this.str.split("\\n");
        this.last_ctx.font =
            this.properties["fontsize"] + "px " + this.properties["font"];
        var max = 0;
        for (var i=0; i < lines.length; i++) {
            var w = this.last_ctx.measureText(lines[i]).width;
            if (max < w) {
                max = w;
            }
        }
        this.size[0] = max + 20;
        this.size[1] = 4 + lines.length * this.properties["fontsize"];

        this.setDirtyCanvas(true);
    };

    WidgetTextOutput.prototype.onPropertyChanged = function(name, value) {
        this.properties[name] = value;
        this.str = typeof value == "number" ? value.toFixed(3) : value;
        //this.resize();
        return true;
    };

    LiteGraph.registerNodeType("UI/Output", WidgetTextOutput);

})(this);






function AJAX(requestData){

    return new Promise(function(resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/DataProcess_ADD', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function(){
            if(xhr.status === 200){
                //Successful response
                const response = JSON.parse(xhr.responseText);
                //console.log(response);
                resolve(response);
            }else{
                reject('Pls, Connection Error try later!');
                alert('Pls, Connection Error try later!');
                //location.reload();
            }
        };
        // const requestData = JSON.stringify({A_GET: Sel_Filename, B_GET: TagetCol_dropdown.value});
        xhr.send(requestData);
    });
}



// WidgetText.prototype.onDrawForeground = function(ctx, a) {
//     //ctx.fillStyle="#000";
//     //ctx.fillRect(0,0,100,60);
//     // ctx.fillStyle = this.properties["color"];
//     // var v = this.properties["value"];

//     // if (this.properties["glowSize"]) {
//     //     ctx.shadowColor = this.properties.color;
//     //     ctx.shadowOffsetX = 0;
//     //     ctx.shadowOffsetY = 0;
//     //     ctx.shadowBlur = this.properties["glowSize"];
//     // } else {
//     //     ctx.shadowColor = "transparent";
//     // }

//     // var fontsize = this.properties["fontsize"];

//     // ctx.textAlign = this.properties["align"];
//     // ctx.font = fontsize.toString() + "px " + this.properties["font"];
//     // this.str =
//     //     typeof v == "number" ? v.toFixed(this.properties["decimals"]) : v;

//     // if (typeof this.str == "string") {
//     //     var lines = this.str.replace(/[\r\n]/g, "\\n").split("\\n");
//     //     var lineHeight = fontsize * 1.2;
//     //     for (var i=0; i < lines.length; i++) {
//     //         ctx.fillText(
//     //             lines[i],
//     //             this.properties["align"] == "left" ? 15 : this.size[0] - 15,
//     //             fontsize * -0.15 + fontsize * (parseInt(i) + 1)
//     //         );
//     //     }

//     //     // Calculate the total height of the text
//     //     var textHeight = lines.length * lineHeight;

//     //     // Adjust the position of the button based on the total height of the text
//     //     var buttonY = this.size[1] + textHeight + 10; // Add some extra spacing

//     //     var buttonHeight = 25;

//     //     // Draw button below the text
//     //     ctx.fillStyle = "blue"; // Button color
//     //     ctx.fillRect(
//     //         this.size[0] * 0.25,
//     //         buttonY,
//     //         this.size[0] * 0.5,
//     //         buttonHeight
//     //     );

//     //     ctx.fillStyle = "white"; // Button text color
//     //     ctx.fillText(
//     //         "Click Me",
//     //         this.size[0] * 0.5,
//     //         buttonY + buttonHeight * 0.75
//     //     );

//     // }

//     // ctx.shadowColor = "transparent";
//     // this.last_ctx = ctx;
//     // ctx.textAlign = "left";

    
//     // Draw button below the text
//     // var margin = 10;
//     // ctx.fillStyle = "black";
//     // ctx.fillRect(
//     //     margin + 1,
//     //     margin + 1,
//     //     this.size[0] - margin * 2,
//     //     this.size[1] - margin * 2
//     // );
//     // ctx.fillStyle = "#AAF";
//     // ctx.fillRect(
//     //     margin - 1,
//     //     margin - 1,
//     //     this.size[0] - margin * 2,
//     //     this.size[1] - margin * 2
//     // );
//     // ctx.fillStyle = this.clicked
//     //     ? "white"
//     //     : this.mouseOver
//     //     ? "#668"
//     //     : "#334";
//     // ctx.fillRect(
//     //     margin,
//     //     margin,
//     //     this.size[0] - margin * 2,
//     //     this.size[1] - margin * 2
//     // );



//     //TEXT
//     ctx.fillStyle = this.properties["color"];
//     var v = this.properties["value"];

//     if (this.properties["glowSize"]) {
//         ctx.shadowColor = this.properties.color;
//         ctx.shadowOffsetX = 0;
//         ctx.shadowOffsetY = 0;
//         ctx.shadowBlur = this.properties["glowSize"];
//     } else {
//         ctx.shadowColor = "transparent";
//     }

//     var fontsize = this.properties["fontsize"];

//     ctx.textAlign = this.properties["align"];
//     ctx.font = fontsize.toString() + "px " + this.properties["font"];
//     this.str =
//         typeof v == "number" ? v.toFixed(this.properties["decimals"]) : v;

//     if (typeof this.str == "string") {
//         var lines = this.str.replace(/[\r\n]/g, "\\n").split("\\n");
//         for (var i=0; i < lines.length; i++) {
//             ctx.fillText(
//                 lines[i],
//                 this.properties["align"] == "left" ? 15 : this.size[0] - 15,
//                 fontsize * -0.15 + fontsize * (parseInt(i) + 1)
//             );
//         }
//     }

//     ctx.shadowColor = "transparent";
//     this.last_ctx = ctx;
//     ctx.textAlign = "left";


//     //BUTTON



// };