$(document).ready(function () {

    var content = $('#content').data('selected');
    $("#content option[value='" + content + "']").attr('selected', 'selected');

    /**
     * Validate Login
     */
    $('#js-login-form').validate();

    /**
     * Nuovo Articolo
     */
    $('#js-articles-add-form').validate({
        submitHandler: function (form) {
            $.ajax({
                url: '/administrator/articles/add',
                type: 'POST',
                data: new FormData(form),
                processData: false,
                contentType: false,
                dataType: 'json',
                cache: false,
                beforeSend: function () {
                    $.isLoading({
                        text: 'Loading',
                        position: 'overlay'
                    });
                },
                statusCode: {
                    200: function (response) {
                        $.isLoading('hide');
                        var output = '<div class="alert alert-success alert-dismissable">' + response.text + '</div>';
                        $('html,body').animate({
                            scrollTop: $('.container').offset().top
                        }, 1000);
                        $('#result').hide().html(output).slideDown();
                    },
                    500: function (response) {
                        $.isLoading('hide');
                        alert(response.responseJSON.err);
                        $('.form-control').val('');
                    }
                }
            });
            return true;
        }
    });

    /**
     * Modifica Articolo
     */
    $('#js-articles-edit-form').validate({
        submitHandler: function (form) {
            $.ajax({
                url: '/administrator/articles/edit/' + $('#id').val(),
                type: 'POST',
                data: new FormData(form),
                processData: false,
                contentType: false,
                dataType: 'json',
                cache: false,
                beforeSend: function () {
                    $.isLoading({
                        text: 'Loading',
                        position: 'overlay'
                    });
                },
                statusCode: {
                    200: function (response) {
                        $.isLoading('hide');
                        var output = '<div class="alert alert-success alert-dismissable">' + response.text + '</div>';
                        $('html,body').animate({
                            scrollTop: $('.container').offset().top
                        }, 1000);
                        $('#result').hide().html(output).slideDown();
                    },
                    500: function (response) {
                        $.isLoading('hide');
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
     * Artists
     */
    $('#js-full-artists').dataTable({
        "ajax": '/administrator/artists.json',
        "language": {
            "url": '/js/jquery.dataTables_messages_it.json'
        },
        "order": [
            [4, 'desc']
        ],
        "columns": [
            {
                'data': 'fullname'
            },
            {
                'data': 'category.fullname'
            },
            {
                'data': 'region.fullname'
            },
            {
                'data': 'active'
            },
            {
                'data': 'registered'
            }
        ],
        columnDefs: [
            {
                targets: 5,
                data: '_id',
                searchable: false,
                render: function (data) {
                    return '<div class="btn-group">' +
                        '<a href="/administrator/artists/edit/' + data + '" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-edit"></span></a>' +
                        '<a href="/administrator/artists/delete/' + data + '" class="btn btn-default btn-sm" onClick="return confirm(\'Sei sicuro di voler cancellare?\');"><span class="glyphicon glyphicon-trash"></span></a>' +
                        '</div>';
                }
            }
        ]
    });

    /**
     * Articles
     */
    $('#js-full-articles').dataTable({
        "ajax": '/administrator/articles.json',
        "language": {
            "url": '/js/jquery.dataTables_messages_it.json'
        },
        "order": [
            [2, 'desc']
        ],
        "columns": [
            {
                'data': 'fullname'
            },
            {
                'data': 'content.fullname'
            },
            {
                'data': 'registered'
            }
        ],
        columnDefs: [
            {
                targets: 3,
                data: '_id',
                searchable: false,
                render: function (data) {
                    return '<div class="btn-group">' +
                        '<a href="/administrator/articles/edit/' + data + '" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-edit"></span></a>' +
                        '<a href="/administrator/articles/delete/' + data + '" class="btn btn-default btn-sm" onClick="return confirm(\'Sei sicuro di voler cancellare?\');"><span class="glyphicon glyphicon-trash"></span></a>' +
                        '</div>';
                }
            }
        ]
    });

});
