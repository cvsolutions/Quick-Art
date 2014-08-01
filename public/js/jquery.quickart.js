$(document).ready(function () {

    /**
     * category
     * @type {*|jQuery}
     */
    var category = $('#category').data('selected');

    /**
     * region
     * @type {*|jQuery}
     */
    var region = $('#region').data('selected');

    /**
     * province
     * @type {*|jQuery}
     */
    var province = $('#province').data('selected');

    /**
     * technique
     * @type {*|jQuery}
     */
    var technique = $('#technique').data('selected');

    /**
     * theme
     * @type {*|jQuery}
     */
    var theme = $('#theme').data('selected');

    /**
     * selected option
     */
    $("#category option[value='" + category + "']").attr('selected', 'selected');
    $("#region option[value='" + region + "']").attr('selected', 'selected');
    $("#province option[value='" + province + "']").attr('selected', 'selected');
    $("#technique option[value='" + technique + "']").attr('selected', 'selected');
    $("#theme option[value='" + theme + "']").attr('selected', 'selected');

    /**
     * Registrazione
     */
    $('#js-registration-form').validate({
        rules: {
            usermail: {
                email: true,
                required: true,
                remote: {
                    url: '/check-usermail',
                    type: 'POST'
                }
            }
        },
        submitHandler: function (form) {
            $.ajax({
                url: '/registrazione',
                type: 'POST',
                data: new FormData(form),
                processData: false,
                contentType: false,
                dataType: 'json',
                cache: false,
                statusCode: {
                    200: function (response) {
                        var output = '<div class="alert alert-success alert-dismissable">' + response.text + '</div>';
                        $('html,body').animate({
                            scrollTop: $('.container').offset().top
                        }, 1000);
                        $('#result').hide().html(output).slideDown();
                    },
                    500: function (response) {
                        alert(response.responseJSON.err);
                        $('.form-control').val('');
                    }
                }
            });
            return true;
        }
    });

    /**
     * Login
     */
    $('#js-login-form').validate();

    /**
     * Modifica Profilo
     */
    $('#js-profile-form').validate({
        rules: {
            usermail: {
                email: true,
                required: true,
                remote: {
                    url: '/extranet/check-exclude-usermail',
                    type: 'POST',
                    data: {
                        id: $('#id').val()
                    }
                }
            }
        },
        submitHandler: function (form) {
            $.ajax({
                url: '/extranet/profile',
                type: 'POST',
                data: new FormData(form),
                processData: false,
                contentType: false,
                dataType: 'json',
                cache: false,
                statusCode: {
                    200: function (response) {
                        var output = '<div class="alert alert-success alert-dismissable">' + response.text + '</div>';
                        $('html,body').animate({
                            scrollTop: $('.container').offset().top
                        }, 1000);
                        $('#result').hide().html(output).slideDown();
                    },
                    500: function (response) {
                        alert(response.responseJSON.err);
                        $('.form-control').val('');
                    }
                }
            });
            return true;
        }
    });

    $('#js-gallery-add-form').validate({
        submitHandler: function (form) {
            $.ajax({
                url: '/extranet/gallery/add',
                type: 'POST',
                data: new FormData(form),
                processData: false,
                contentType: false,
                dataType: 'json',
                cache: false,
                statusCode: {
                    200: function (response) {
                        var output = '<div class="alert alert-success alert-dismissable">' + response.text + '</div>';
                        $('html,body').animate({
                            scrollTop: $('.container').offset().top
                        }, 1000);
                        $('#result').hide().html(output).slideDown();
                    },
                    500: function (response) {
                        alert(response.responseJSON.err);
                        $('.form-control').val('');
                    }
                }
            });
            return true;
        }
    });

    /**
     * Modifica Foto
     */
    $('#js-gallery-edit-form').validate({
        submitHandler: function (form) {
            $.ajax({
                url: '/extranet/gallery/edit/' + $('#id').val(),
                type: 'POST',
                data: new FormData(form),
                processData: false,
                contentType: false,
                dataType: 'json',
                cache: false,
                statusCode: {
                    200: function (response) {
                        var output = '<div class="alert alert-success alert-dismissable">' + response.text + '</div>';
                        $('html,body').animate({
                            scrollTop: $('.container').offset().top
                        }, 1000);
                        $('#result').hide().html(output).slideDown();
                    },
                    500: function (response) {
                        alert(response.responseJSON.err);
                        $('.form-control').val('');
                    }
                }
            });
            return true;
        }
    });

    /**
     * keyup hide result
     */
    $('form').keyup(function () {
        $('#result').slideUp();
    });

    /**
     * stringToSlug
     */
    $('#fullname').stringToSlug({
        setEvents: 'keyup keydown blur',
        getPut: '#slug',
        space: '-',
        prefix: '',
        suffix: '',
        replace: '',
        AND: 'and',
        callback: false
    });

    /**
     * dataTable
     */
    $('#js-full-gallery').dataTable({
        "ajax": '/extranet/gallery/photos.json',
        "order": [
            [3, 'desc']
        ],
        "columns": [
            {
                'data': 'fullname'
            },
            {
                'data': 'technique.fullname'
            }
        ],
        columnDefs: [
            {
                targets: 2,
                data: 'picture',
                render: function (data, type, row) {
                    return  row.height + 'x' + row.width + 'x' + row.depth + ' cm';
                }
            },
            {
                targets: 3,
                data: '_id',
                searchable: false,
                render: function (data) {
                    return '<div class="btn-group">' +
                        '<a href="/extranet/gallery/edit/' + data + '" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-edit"></span></a>' +
                        '<a href="/extranet/gallery/delete/' + data + '" class="btn btn-default btn-sm" onClick="return confirm(\'Sei sicuro di voler cancellare?\');"><span class="glyphicon glyphicon-trash"></span></a>' +
                        '</div>';
                }
            }
        ]
    });

    /**
     * filestyle
     */
    $(':file').filestyle();

    /**
     * resizecrop
     */
    $('.js-rc-350').resizecrop({
        width: 350,
        height: 150,
        vertical: "top"
    });

    /**
     * resizecrop
     */
    $('.js-rc-240').resizecrop({
        width: 240,
        height: 150,
        vertical: "top"
    });

    /**
     * resizecrop
     */
    $('.js-rc-480').resizecrop({
        width: 480,
        height: 200,
        vertical: "top"
    });
});
