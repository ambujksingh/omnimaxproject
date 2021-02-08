let DetailArray = [];

function getOrderList() {
    // Instantiate an new XHR Object 
    const xhr = new XMLHttpRequest();
    xhr.open("GET",
        "http://localhost:3009/orders", true);

    xhr.onload = function () {
        if (this.status === 200) {
            let obj = JSON.parse(this.responseText);
            for (let i = 0; i < obj.length; i++) {
                let orders = obj[i];
                orderFunction(orders);
            }
        }
        else {
            console.log("File not found");
        }
    }
    xhr.send();
}

function orderFunction(orders) {
    let table = document.getElementById("mytable");
    let row = table.insertRow(1);
    let cell0 = row.insertCell(0);
    let cell1 = row.insertCell(1);
    let cell2 = row.insertCell(2);
    let cell3 = row.insertCell(3);
    let cell4 = row.insertCell(4);
    cell0.innerHTML = orders.order_Id;
    cell1.innerHTML = orders.FirstName;
    cell2.innerHTML = moment(orders.date).format('YYYY/MM/DD');
    cell3.innerHTML = orders.Status;
    cell4.innerHTML = `<a href="Details.html?order_Id=${orders.order_Id}"><button type="button" class="btn btn-outline-primary btn-sm" style="margin-left: 16px;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
  </svg></button></a> `;
};

function getProductList() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET",
        "http://localhost:3009/product", true);
    xhr.onload = function () {
        if (this.status === 200) {
            let obj = JSON.parse(this.responseText);
            // console.log(this.responseText);
            // console.log(obj.length);
            // console.log(obj);
            for (let i = 0; i < obj.length; i++) {
                let product = obj[i];
                // console.log(product);
                getproductTable(product);
            }
        }
        else {
            console.log("File not found");
        }
    }
    xhr.send();
};

function getproductTable(product) {
    let table = document.getElementById("productTable");
    let row = table.insertRow(1);
    let cell0 = row.insertCell(0);
    let cell1 = row.insertCell(1);
    let cell2 = row.insertCell(2);
    let cell3 = row.insertCell(3);
    let cell4 = row.insertCell(4);
    cell0.innerHTML = `<input type="checkbox" id="checkBox_${product.product_Id}" onclick="Checkbox(${product.product_Id})" >`
    cell1.innerHTML = product.productName;
    cell2.innerHTML = product.description;
    cell3.innerHTML = product.price;
    cell4.innerHTML = `<input type="number" id="number_${product.product_Id}" oninput="numberValue(${product.product_Id})" value="1" disabled>`
};

function Checkbox(product_Id) {
    let order_Id = getOrderId();
    let checkbox = document.getElementById(`checkBox_${product_Id}`);
    if (checkbox.checked == true) {
        let numberValueId = document.getElementById(`number_${product_Id}`);
        numberValueId.disabled = false;
        let productDetailJson = {
            'product_Id': `${product_Id}`,
            'order_Id': `${order_Id}`,
            'quantity': `${numberValueId.value}`
        }
        DetailArray.push(productDetailJson);
        console.log('the global array is', DetailArray);

    } else if (checkbox.checked == false) {
        let checkboxId = document.getElementById(`number_${productId}`);
        let index = DetailArray.findIndex(a => a.productId == productId);
        let removed = DetailArray.splice(index,1);
        checkboxId.disabled = true;
        // DetailArray.splice(DetailArray,1)
        console.log('array after edit ',DetailArray);
        // console.log('Your index value is ',index);
    }else{
        
    }
}

function numberValue(product_Id) {
    let getNumber = document.getElementById(`number_${product_Id}`);
    getNumber.value;
    console.log('your value is ', getNumber.value);
    let newArray = DetailArray.filter(getNumber => {
        // console.log('the getnumber is ', getNumber);
        if (getNumber.productId == productId) {
            return true
        } else {
            return false
        }
    })
    newArray[0].quantity = getNumber.value;
    console.log('the global array after update', DetailArray);

};

function addNewOrderDetails() {
    let DetailArray = [];
    ajax({
        type: 'POST',
        data: JSON.stringify(DetailArray),
        url: "http://localhost:3009/orderdetails/DetailArray",
        contentType: "application/json",
    });
};



function searchFunction() {
    let input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("basic-text1");
    filter = input.value.toUpperCase();
    table = document.getElementById("productTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].display = "";
            } else {
                tr[i].display = "none";
            }
        }
    } 
}

function onFormSubmit() {
    let order_Id = getOrderId();
    if (!order_Id) {
        // let orderinput = document.getElementById("order_Id");
        // orderinput.style.display = "none";
        insertNewRecord();
    } else {
        updateRecord()
        // alert("Looking for an update")
    }
};

function insertNewRecord() {
    // alert('your order has been created')
    //let order_Id = document.getElementById('order_Id').value;
    let FirstName = document.getElementById('FirstName').value;
    let ContactNumber = document.getElementById('ContactNumber').value;
    let Address = document.getElementById('Address').value;
    let Email = document.getElementById('confirm_email').value;
    let Country = document.getElementById('Country').value;
    let City = document.getElementById('City').value;
    let State = document.getElementById('State').value;
    let date = document.getElementById('date').value;
    let Status = document.getElementById('Status').value;
    fetch('http://localhost:3009/orders', {
        method: 'POST',
        body: JSON.stringify({
            // // order_Id: order_Id,
            FirstName: FirstName,
            ContactNumber: ContactNumber,
            Address: Address,
            Email: Email,
            Country: Country,
            City: City,
            State: State,
            date: date,
            Status: Status,
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then(response => response.json())
        .then(json => {
            console.log(json);
            let orderid = json.orderid;
            console.log(json);
            window.location.href = `E:/Node.js-crud-main/Omnimax_Web/Details.html?order_Id=${orderid}`;
        })
        .catch(err => {
            console.log(err);
        });
};

function updateRecord() {
    let order_Id = document.getElementById('order_Id').value;
    let FirstName = document.getElementById('FirstName').value;
    let ContactNumber = document.getElementById('ContactNumber').value;
    let Address = document.getElementById('Address').value;
    let Email = document.getElementById('confirm_email').value;
    let Country = document.getElementById('Country').value;
    let City = document.getElementById('City').value;
    let State = document.getElementById('State').value;
    let date = document.getElementById('date').value;
    let Status = document.getElementById('Status').value;
    fetch('http://localhost:3009/orders', {
        method: 'PUT',
        body: JSON.stringify({
            order_Id: order_Id,
            FirstName: FirstName,
            ContactNumber: ContactNumber,
            Address: Address,
            Email: Email,
            Country: Country,
            City: City,
            State: State,
            date: date,
            Status: Status,
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then(response => response.json())
        .then(json => console.log(json))
};

/**
 * This function returns order id if getting from URL parameters
 *
 * @return {*} 
 */
function getOrderId() {
    let geturl = window.location.search.slice(1);
    geturl = geturl.replace(/=/g, '":"');
    geturl = geturl.replace(/&/g, '","');
    if (geturl == "") return;
    geturl = '{"' + geturl + '"}';
    let order = JSON.parse(geturl);
    return order.order_Id;
};


function insertNewRecord() {

    fetch('http://localhost:3009/orderdetails', {
        method: 'POST',
        body: DetailArray [
            {
              order_Id: product_Id,
              product_Id: order_Id,
              created_Date: '2020-12-27',
              quantity: numberValueId.value
            }
          ],
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        } 
    })
        .then(response => response.json())
        .then(json => {
            console.log(json);
            let orderid = json.orderid;
            console.log(json);
            window.location.href = `E:/Node.js-crud-main/Omnimax_Web/Details.html?order_Id=${orderid}`;
        })
        .catch(err => {
            console.log(err);
        });
};


function onLoadDetailsPage() {
    datepicker();
    let orderId = getOrderId();
    //console.log(obj.order_Id);
    if (!orderId) {
        let fetchBtn = document.getElementById("fetchBtn");
        fetchBtn.style.display = "none";

        let ProductTableList = document.getElementById("orderDetailTable");
        ProductTableList.style.display = "none";
    } else {

        getOrderByIdFromDB(orderId, function (response) {
            console.log(`response from callback: `, response);
            // console.log(`Firstname:`,);
            document.getElementById('order_Id').value = response[0].order_Id;
            document.getElementById('FirstName').value = response[0].FirstName;
            document.getElementById('ContactNumber').value = response[0].ContactNumber;
            document.getElementById('Address').value = response[0].Address;
            document.getElementById('confirm_email').value = response[0].Email;
            document.getElementById('Country').value = response[0].Country;
            document.getElementById('City').value = response[0].City;
            document.getElementById('State').value = response[0].State;
            document.getElementById('date').value = moment(response[0].date).format('YYYY/MM/DD');
            document.getElementById('Status').value = response[0].Status;
        });
    }
};

function getOrderByIdFromDB(order_Id, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET",
        `http://localhost:3009/orders/${order_Id}`, true);

    // When response is ready 
    xhr.onload = function () {
        if (this.status === 200) {
            let order = JSON.parse(this.responseText);
            callback(order);
        }
        else {
            console.log("File not found");
        }
    }
    // At last send the request 
    xhr.send();
};

//date
function datepicker() {
    $(function () {
        $('.input-group.date').datepicker({
            format: 'yyyy-mm-dd',
            orientation: "auto left",
            forceParse: false,
            autoclose: true,
            todayHighlight: true,
            toggleActive: true
        });
    });
};

// validation form
(function () {
    'use strict';
    window.addEventListener('load', function () {
        let forms = document.getElementsByClassName('needs-validation');
        let validation = Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    }, false);
})();


function getorderdetailsList() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET",
        "http://localhost:3009/orderdetails", true);
    xhr.onload = function () {
        if (this.status === 200) {
            let obj = JSON.parse(this.responseText);
            console.log(this.responseText);
            console.log(obj.length);
            console.log(obj);
            for (let i = 0; i < obj.length; i++) {
                let orderdetails = obj[i];
                console.log(orderdetails);
                getorderdetailsTable(orderdetails);
            }
        }
        else {
            console.log("File not found");
        }
    }
    xhr.send();
};

function getorderdetailsTable(orderdetails) {
    let table = document.getElementById("orderDetailTable");
    let row = table.insertRow(1);
    let cell0 = row.insertCell(0);
    let cell1 = row.insertCell(1);
    let cell2 = row.insertCell(2);
    let cell3 = row.insertCell(3);
    let cell4 = row.insertCell(4);
    cell0.innerHTML = orderdetails.order_Details_Id;
    cell1.innerHTML = orderdetails.order_Id
    cell2.innerHTML = orderdetails.product_Id
    cell3.innerHTML = moment(orderdetails.created_Date).format('YYYY/MM/DD');
    cell4.innerHTML = orderdetails.quantity
};



