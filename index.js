var tablesData;
        var itemsData;
        window.onload = function()
        {
            tablesData = JSON.parse(document.getElementById("tablesJson").innerHTML);
            for(var i in tablesData)
            {
                var table = document.createElement("div");
                table.id = "table"+i;
                table.className = "table";
                table.index=i;
                table.addEventListener("drop",function(e){  drop(e,this); });
                table.addEventListener("dragover",allowDrop);
                table.addEventListener("click",openTable);
                var tableNo = document.createElement("div");
                tableNo.className = "table_number";
                tableNo.innerHTML = tablesData[i].name;
                var tableDetails  = document.createElement("div");
                tableDetails.className = "table_info";
                tableDetails.innerHTML = "Rs."+tablesData[i].cost+" | Total items: "+Object.keys(tablesData[i].items).length;
                table.append(tableNo);
                table.append(tableDetails);
                var tables = document.getElementById("tables");
                tables.appendChild(table);
            }
            itemsData = JSON.parse(document.getElementById("itemsJson").innerHTML);
            for(var i in itemsData)
            {
                var item = document.createElement("div");
                item.id = "item"+i;
                item.index=i;
                item.className = "item";
                item.draggable = "true";
                item.addEventListener("dragstart",drag);
                var itemName = document.createElement("div");
                itemName.className = "item_name";
                itemName.innerHTML = itemsData[i].name;
                var itemCost  = document.createElement("div");
                itemCost.className = "item_price";
                itemCost.innerHTML = "Rs."+itemsData[i].price;;
                item.append(itemName);
                item.append(itemCost);
                var items = document.getElementById("items");
                items.appendChild(item);
            }
        }
        function searchTables(event){
            var searchText = event.target.value.toLowerCase();
            for(var i in tablesData){
                if(tablesData[i].name.toLowerCase().indexOf(searchText) >= 0)
                {
                    document.getElementById("table"+i).style.display = "";
                }
                else
                {
                    document.getElementById("table"+i).style.display = "none";
                }
            }
        }
        function searchItems(event)
        {
            var searchText = event.target.value.toLowerCase();
            for(var i in itemsData)
            {
                if(itemsData[i].name.toLowerCase().indexOf(searchText) >=0 
                    || itemsData[i].course.toLowerCase().indexOf(searchText) >=0 
                    || itemsData[i].cuisine.toLowerCase().indexOf(searchText) >=0)
                {
                    document.getElementById("item"+i).style.display = "block";
                }
                else
                {
                    document.getElementById("item"+i).style.display = "none";
                }
            }
        }
        function allowDrop(e) 
        {
          e.preventDefault();
        }
        function drag(e) 
        {
          e.dataTransfer.setData("text", e.target.index);
        }
        function drop(e,dropAt) 
        {
          e.preventDefault();
          var itemId = e.dataTransfer.getData("text");
          var tableId = dropAt.index;
          addItemToTable(tableId,itemId);
        }
        function addItemToTable(tableId,itemId)
        {
            if(tablesData[tableId].items.hasOwnProperty(itemId))
            {
                  tablesData[tableId].items[itemId].quantity += 1;
            }
            else
            {
                  tablesData[tableId].items[itemId] = { "item":itemsData[itemId],"quantity":1 };                                                                    
            }
            tablesData[tableId].cost = getTotalCost(tableId);
            document.querySelector("#table"+tableId+" .table_info").innerHTML = "Rs."+tablesData[tableId].cost+" | Total items: "+Object.keys(tablesData[tableId].items).length;
        }
        function getTotalCost(tableId)
        {
            var cost = 0;
            for(var i in tablesData[tableId].items){
                cost += tablesData[tableId].items[i].item.price * tablesData[tableId].items[i].quantity;
            }
            return cost;
        }
        function openTable()
        {
                var tableId = this.index;
                var tableHead = document.createElement("div");
                tableHead.className = "table_box_head";
                tableHead.innerHTML = "Order details of Table.No "+tableId;
                var tableBoxContent = document.createElement("div");
                tableBoxContent.className = "table_box_content";
                var out = "";
                out += '<table class="table_items">';
                out += '<tr><th>S.no</th><th>Item</th><th>Price</th><th>Number of servings</th></tr>';
                var count = 1;
                for(var i in tablesData[tableId].items){
                    out += '<tr id="table-item-'+i+'"><td>'+count+'</td><td>'+tablesData[tableId].items[i].item.name+'</td>';
                    out += '<td>'+tablesData[tableId].items[i].item.price+'</td>';
                    out += '<td><input type="number" id="quantity" value="'+tablesData[tableId].items[i].quantity+'" min="1" onchange="setItemQuantity('+tableId+','+i+',this.value)" onkeyup="setItemQuantity('+tableId+','+i+',this.value)"/></td>';
                    out += '<td><i class="material-icons" onclick="deleteItem('+tableId+','+i+')" style="font-size:18px; color:#222; cursor:pointer;">delete</i></td></tr>';
                    count++;
                }
                out += '<tr><td></td><td></td><td id="total_cost">Total: '+tablesData[tableId].cost+'</td></table>';
                out += '<div class="clear_table" onclick="clearTable('+tableId+')"><button>Generate Bill</button></div>';
                tableBoxContent.innerHTML = out;
                var tableBox = document.getElementById("table_box");
                tableBox.innerHTML = "";
                tableBox.append(tableHead);
                tableBox.append(tableBoxContent);
                document.querySelector(".table_details_outer_div").style.display = "block";
                this.style.backgroundColor = "#999922";
        }
        function closeTable(){
                document.querySelector(".table_details_outer_div").style.display = "none";
        }
        function setItemQuantity(tableId,itemId,quantity){
                tablesData[tableId].items[itemId].quantity = parseInt(quantity);
                tablesData[tableId].cost = getTotalCost(tableId);
                document.getElementById("total_cost").innerHTML = "Total: "+tablesData[tableId].cost;
                document.querySelector("#table"+tableId+" .table_info").innerHTML = "Rs."+tablesData[tableId].cost+" | Total items: "+Object.keys(tablesData[tableId].items).length;
        }
        
        function deleteItem(tableId,itemId){
                var item = document.getElementById("table-item-"+itemId);
                item.parentNode.removeChild(item);
                delete tablesData[tableId].items[itemId];
                tablesData[tableId].cost = getTotalCost(tableId);
                document.querySelector("#table"+tableId+" .table_info").innerHTML = "Rs."+tablesData[tableId].cost+" | Total items: "+Object.keys(tablesData[tableId].items).length;
                document.getElementById("total_cost").innerHTML = "Total: "+tablesData[tableId].cost;
        }
        
        function clearTable(tableId){
                closeTable();
                tablesData[tableId].items = {};
                tablesData[tableId].cost = 0;
                document.querySelector("#table"+tableId+" .table_info").innerHTML = "Rs."+tablesData[tableId].cost+" | Total items: "+Object.keys(tablesData[tableId].items).length;
        }
        window.onclick = function(event) {
             if (event.target.id == "table_outer") {
                  closeTable();
             }
        }

        