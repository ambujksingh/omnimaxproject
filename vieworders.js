
let DetailArray = [];

// validation form
// Example starter JavaScript for disabling form submissions if there are invalid fields
(function() {
  'use strict';
  window.addEventListener('load', function() {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    // @ts-ignore
    var validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }else{
            onFormSubmit()
        }

        form.classList.add('was-validated');
      }, false);
    });
  }, false);
})();
//on body load function
function start() {
    let order_Id = getOrderId();
    onLoadDetailsPage();
    getorderdetailsList(order_Id);
    // dropdown();

}

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
      // @ts-ignore
    let row = table.insertRow(1);
    let cell0 = row.insertCell(0);
    let cell1 = row.insertCell(1);
    let cell2 = row.insertCell(2);
    let cell3 = row.insertCell(3);
    let cell4 = row.insertCell(4);
    
    cell0.innerHTML = orders.order_Id;
    cell1.innerHTML = orders.FirstName;
    // @ts-ignore
    cell2.innerHTML = moment(orders.date).format('YYYY/MM/DD');
    cell3.innerHTML = orders.Status;
    cell4.innerHTML = `<a href="Details.html?order_Id=${orders.order_Id}"><button type="button" class="btn btn-outline-primary btn-sm"><img src="DashboardSvg/listEdit.svg" class="img-fluid-date-listEdit"></img></button></a> 
    <a href="viewOrder.html?order_Id=${orders.order_Id}"><button type="button" class="btn btn-outline-primary btn-sm"><img src="DashboardSvg/arrowbox.svg" class="img-fluid-date-listEdit"></img></button></a>
`;
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
      // @ts-ignore
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
    cell4.innerHTML = `<input type="number" id="number_${product.product_Id}" oninput="numberValue(${product.product_Id})" value="1" min="1" max="45" disabled>`
};

//checkbox function
function Checkbox(product_Id) {
    let order_Id = getOrderId();
    let checkbox = document.getElementById(`checkBox_${product_Id}`);
      // @ts-ignore
    if (checkbox.checked == true) {
        let numberValueId = document.getElementById(`number_${product_Id}`);
          // @ts-ignore
        numberValueId.disabled = false;
        let productDetailJson = {
            'product_Id': `${product_Id}`,
            'order_Id': `${order_Id}`,
              // @ts-ignore
            'quantity': `${numberValueId.value}`
            
        }
        DetailArray.push(productDetailJson);
        console.log('the global array is', DetailArray);
  // @ts-ignore
    } else if (checkbox.checked == false) {
        let checkboxId = document.getElementById(`number_${product_Id}`);
        let index = DetailArray.findIndex(a => a.productId == product_Id);
        // @ts-ignore
        let removed = DetailArray.splice(index, 1);
          // @ts-ignore
        checkboxId.disabled = true;
        // DetailArray.splice(DetailArray,1)
        console.log('array after edit ', DetailArray);
        // console.log('Your index value is ',index);
    } else {

    }
}

function numberValue(product_Id) {
    let getNumber = document.getElementById(`number_${product_Id}`);
      // @ts-ignore
    getNumber.value;
      // @ts-ignore
    console.log('your value is ', getNumber.value);
    let newArray = DetailArray.filter(getNumber => {
        // console.log('the getnumber is ', getNumber);
        if (getNumber.product_Id == product_Id) {
            return true
        } else {
            return false
        }
    })  // @ts-ignore
    newArray[0].quantity = getNumber.value;
    console.log('the global array after update', DetailArray);

};

// form Submit function
function onFormSubmit() {
    let order_Id = getOrderId();
    if (!order_Id) {
        insertNewRecord();
    } else {
        updateRecord()
    }
};

function insertNewRecord() {
      // @ts-ignore
    let FirstName = document.getElementById('FirstName').value;
      // @ts-ignore
    let ContactNumber = document.getElementById('ContactNumber').value;
      // @ts-ignore
    let Address = document.getElementById('Address').value;
      // @ts-ignore
    let Email = document.getElementById('confirm_email').value;
      // @ts-ignore
    let Country = document.getElementById('Country').value;
      // @ts-ignore
    let City = document.getElementById('City').value;
      // @ts-ignore
    let State = document.getElementById('State').value;
      // @ts-ignore
    let date = document.getElementById('date').value;
    fetch('http://localhost:3009/orders', {
        method: 'POST',
        body: JSON.stringify({
            FirstName: FirstName,
            ContactNumber: ContactNumber,
            Address: Address,
            Email: Email,
            Country: Country,
            City: City,
            State: State,
            date: date,
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
            window.location.href = `file:///E:/PROJECTS/Omnimax_Web/Details.html?order_Id=${orderid}`;
        })
        .catch(err => {
            console.log(err);
        });
};

function updateRecord() {
    // @ts-ignore
    let order_Id = document.getElementById('order_Id').value;
      // @ts-ignore
    let FirstName = document.getElementById('FirstName').value;
      // @ts-ignore
    let ContactNumber = document.getElementById('ContactNumber').value;
      // @ts-ignore
    let Address = document.getElementById('Address').value;
      // @ts-ignore
    let Email = document.getElementById('confirm_email').value;
      // @ts-ignore
    let Country = document.getElementById('Country').value;
      // @ts-ignore
    let City = document.getElementById('City').value;
      // @ts-ignore
    let State = document.getElementById('State').value;
      // @ts-ignore
    let date = document.getElementById('date').value;
    // let Status = document.getElementById('Status').value;
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
            // Status: Status,
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

function addproduct() {
    productRecord();

    setTimeout(function () {
        window.location.reload();
    }, 100);

}

function productRecord() {

    fetch('http://localhost:3009/orderdetails', {
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(DetailArray),

    })
        .then(response => response.json())
        .then(json => console.log(json))
};


function deleteProductRecord(order_Details_Id) {
    fetch(`http://localhost:3009/orderdetails/${order_Details_Id}`, {
        method: 'DELETE',
    })

};

// on load get value from response
function onLoadDetailsPage() {
    datepicker();

    let orderId = getOrderId();
    if (!orderId) {
        let orderInputbox = document.getElementById('order_Id');
        orderInputbox.style.display = 'none';
     
        let fetchBtn = document.getElementById("fetchBtn");
        fetchBtn.style.display = "none";

        let ProductTableList = document.getElementById("orderDetailTable");
        ProductTableList.style.display = "none";

    } else {
        // let pText = document.getElementById('orderAddText');
        // pText.style.display = 'none';
        let label = document.getElementById('orderIdLable');
        label.style.color = "black";
        let submitbutton = document.getElementById('btn-10');
        submitbutton.style.display = 'none';
         let checkForm = document.getElementById('formCheck');
         checkForm.style.display = 'none';
        getOrderByIdFromDB(orderId, function (response) {
            console.log(`response from callback: `, response);
            document.getElementById('order_Id').innerHTML = response[0].order_Id;
            document.getElementById('FirstName').innerHTML = response[0].FirstName;
            document.getElementById('ContactNumber').innerHTML = response[0].ContactNumber;
            document.getElementById('Address').innerHTML = response[0].Address;
            document.getElementById('confirm_email').innerHTML = response[0].Email;
            document.getElementById('Country').innerHTML = response[0].Country;
            // onCountryChange();
            document.getElementById('State').innerHTML = response[0].State;
            // onStateChange();
            document.getElementById('City').innerHTML = response[0].City;
            // @ts-ignore
            document.getElementById('date').innerHTML = moment(response[0].date).format('YYYY/MM/DD');
            // document.getElementById('Status').value = response[0].Status;
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
      // @ts-ignore
    document.getElementById('date').value = new Date().toJSON().slice(0,10)

    $(function () {
        $('.input-group.date').datepicker({
            format: 'yy-mm-dd',
            startDate: '-10d',
            // @ts-ignore
            endDate: '+10d',
            orientation: "auto left",
            autoclose: true,
            todayHighlight: true,
            toggleActive: true,
            

        });
    });
};

//
let grandTotal = 0; 
function getorderdetailsList(order_Id) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET",
        `http://localhost:3009/orderdetails/${order_Id}`, true);
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

                if(!orderdetails){
                    // let pText = document.getElementById('orderAddText');
                    // pText.style.display = 'show';
                }else{
                    // let pText = document.getElementById('orderAddText');
                    // pText.style.display = 'none';
                }
            }

            console.log('what is total', grandTotal);
        }
        else {
            console.log("File not found");
        }
    }
    xhr.send();
};

function getorderdetailsTable(orderdetails) {

    let table = document.getElementById("orderDetailTable");
    // @ts-ignore
    let row = table.insertRow(1);
    let cell0 = row.insertCell(0);
    let cell1 = row.insertCell(1);
    let cell2 = row.insertCell(2);
    let cell3 = row.insertCell(3);
    let cell4 = row.insertCell(4);
    let cell5 = row.insertCell(5);
    let cell6 = row.insertCell(6);
    // let cell7 = row.insertCell(7);
    cell0.innerHTML = orderdetails.productName;
    cell1.innerHTML = orderdetails.description;
    cell2.innerHTML = orderdetails.price;
    cell3.innerHTML = orderdetails.quantity;

    let productPrice = orderdetails.price * orderdetails.quantity;
    let tax = (productPrice * 10) / 100;
    let totalPrice = productPrice + tax;

    // @ts-ignore
    grandTotal += parseInt(totalPrice);
    
    cell4.innerHTML = tax;
    cell5.innerHTML = totalPrice;
    // @ts-ignore
    cell6.innerHTML = moment(orderdetails.date).format('YYYY/MM/DD');
    // cell7.innerHTML =  `<img src="DashboardSvg/delete.svg" class="img-fluid-date-delete" 
    // onclick="deleteProductRecord(${orderdetails.order_Details_Id})">`;
    // @ts-ignore
    cell7 = document.getElementById('grandTotal');
    // @ts-ignore
    cell7.innerHTML  = grandTotal;
};


function searchFunction() {
      // @ts-ignore
    let filter = document.getElementById('searchInput').value.toUpperCase();
    let productTableBar = document.getElementById('productTable');
    let tr = productTableBar.getElementsByTagName('tr');

    for (let i = 1; i < tr.length; i++) {
        let td = tr[i].getElementsByTagName('td')[1];
        if (td) {
            let textvalue = td.textContent || td.innerHTML;
            if (textvalue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = '';
            } else {
                tr[i].style.display = 'none';
            }
        }
    }
}


/*


*/