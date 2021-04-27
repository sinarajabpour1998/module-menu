let menu_group = $('.menu_group').val();

let not_information = '<tr class="not_information"><td class="text-center" colspan="5">موردی برای نمایش وجود ندارد</td></tr>';

let front_menu_loading = `
<tr class="has_fields">
     <td class="text-center" colspan="5">
          <div class="d-flex justify-content-center">
                <div class="my-4">
                    <div class="spinner-border text-warning" role="status">
                        <span class="sr-only"></span>
                    </div>
                    <div class="mt-2">
                        لطفا منتظر بمانید...
                    </div>
                </div>
          </div>
     </td>
</tr>
`;

(function() {
    load_front_menu(false);
})();

// start load menus from database
function load_front_menu(empty_table) {
    const site_menus_table = $('#site_menus_table tbody');
    if (empty_table == true){
        site_menus_table.html(front_menu_loading);
    }
    $.ajax({
        type: "post",
        url: baseUrl + '/panel/front-menu/get/menus/' + menu_group,
        dataType: 'json',
        success: function (response) {
            site_menus_table.find('.has_menus').hide(1000);
            setTimeout(function (){
                if (response.length > 0){
                    for( let i=0; i<response.length; i++ ){
                        add_menu_row( $('#site_menus_table tbody'), response[i].title, response[i].status, response[i].id );
                    }
                }else {
                    site_menus_table.append(not_information);
                }
            }, 1000);
        }
    });
}
// end load menus from database

// start add menus row after insert menus in ajax
function add_menu_row( target, menu_title, menu_status, menu_id ){
    target.append(
        "<tr class='list_row'>" +
        "<td>" + menu_id + " <input type='hidden' name='menus_id[]' value='" + menu_id + "'></td>" +
        "<td>" + menu_title + " </td>" +
        "<td>" + menu_status + "</td>" +
        "<td>" +
        "<a href='#' data-id='"+menu_id+"' class='btn btn-sm btn-success edit_menu'>ویرایش</a>" +
        "<a href='#' data-id='"+menu_id+"' class='btn btn-sm btn-danger delete_menu ml-lg-1'>حذف</a>" +
        "</td>" +
        "</tr>"
    );
}
// end add menus row after insert menus in ajax

// start delete menu action
$('#site_menus_table').on('click', '.delete_menu', function (e) {
    e.preventDefault();

    const target = $(this);
    let id = $(this).data('id');

    Swal.fire({
        title: 'آیا برای حذف اطمینان دارید؟',
        icon: 'warning',
        showCancelButton: true,
        customClass: {
            confirmButton: 'btn btn-danger mx-2',
            cancelButton: 'btn btn-light mx-2'
        },
        buttonsStyling: false,
        confirmButtonText: 'حذف',
        cancelButtonText: 'لغو',
        showClass: {
            popup: 'animated fadeInDown'
        },
        hideClass: {
            popup: 'animated fadeOutUp'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "delete",
                url: baseUrl + '/panel/front-menu/' + id,
                dataType: 'json',
                success: function (response) {
                    Swal.fire({
                        icon: 'success',
                        text: 'عملیات حذف با موفقیت انجام شد.',
                        confirmButtonText:'تایید',
                        customClass: {
                            confirmButton: 'btn btn-success',
                        },
                        buttonsStyling: false,
                        showClass: {
                            popup: 'animated fadeInDown'
                        },
                        hideClass: {
                            popup: 'animated fadeOutUp'
                        }
                    })
                        .then((response) => {
                            target.closest('tr').remove();
                            hasMenu();
                        });
                }
            });


        }
    })
});
// end delete menu action

// start check if has not field then show not found
function hasMenu(){
    $.ajax({
        type: "post",
        url: baseUrl + '/panel/front-menu/get/menus/' + menu_group,
        dataType: 'json',
        success: function (response) {
            if (!response.length > 0){
                $('#site_menus_table tbody').append(not_information);
            }
        }
    });
}
// end check if has not field then show not found

// start add new menu ajax handler
$('.add_menu').on('click', function(e) {
    e.preventDefault();
    let menu_id = $('.menu_id').val();
    let modal_id = $(this).data('modal');
    $.ajax({
        type: 'patch',
        url: baseUrl + '/panel/front-menu/update/' + menu_group,
        data: $('#menu_data :input').serialize(),
        dataType: 'json',
        success: function (response) {
            $('.not_information').hide();
            $('.has_information').hide();
            if (menu_id == 0){
                add_menu_row($('#site_menus_table tbody'), response.title, response.status, response.id);
                $('#menu_data :input').val('');
            }else {
                load_front_menu(true);
            }
            hide_error_messages();
            show_success_message(modal_id,response.message);
        },
        error: function (response) {
            show_error_messages(response);
        }
    });
});
// end new menu ajax handler

// start hide menu error messages before and after ajax submit
function hide_error_messages(){
    $('.form-group')
        .find('.invalid-feedback')
        .addClass('d-none')
        .find('strong').text('');
    $('.form-group')
        .find('.is-invalid')
        .removeClass('is-invalid');
}
// end hide menu error messages before and after ajax submit

// start show success messages for ajax request
function show_success_message(modal_id,message){
    $('#' + modal_id).find('.assign_success').text('');
    $('#' + modal_id).find('.assign_success').html(
        '<div class="alert alert-success alert-dismissible fade show" role="alert">' +
        message +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
        '<span aria-hidden="true">&times;</span>' +
        '</button>' +
        '</div>'
    );
}
// end show success messages for ajax request

// start show error messages for ajax menu
function show_error_messages(res){
    let response = res;
    $('.form-group')
        .find('.invalid-feedback')
        .addClass('d-none')
        .find('strong').text('');
    $('.form-group')
        .find('.is-invalid')
        .removeClass('is-invalid')
    if (response.status === 422) {
        for( const field_name in response.responseJSON.errors ){
            if(response.responseJSON.errors[field_name]) {
                let target = $('[name=' + field_name + ']');
                target.addClass('is-invalid');
                target.closest('.form-group')
                    .find('.invalid-feedback')
                    .removeClass('d-none')
                    .find('strong').text(response.responseJSON.errors[field_name]);
            }
        }
    }
}
// end show error messages for ajax menu