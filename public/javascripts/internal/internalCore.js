/**
 * Created by PA_VSridha on 9/16/2016.
 */


$(function () {
    $('.tooltip-feature').tooltip()

    $('.nav-item').click(function () {
        $('.nav-item').removeClass('active');
        $(this).addClass('active')
        $(this).addClass('text-primary')
    })
    $('label.tree-toggler').click(function () {

        $(this).parent().children('ul.tree').toggle(300);
    });

    $('#nav-projects').click(function () {

        window.location = "/projects"

    })

    $('#nav-home').click(function () {

        window.location = "/"

    })


})
var load_projects = function () {
    // $.ajax({
    //     url: "http://localhost:8083/api/projects/",
    //     crossDomain: true
    // }).done(function (data) {});
    projects = [
        {
            "project_id": "n001",
            "project_name": "test_project",
            "project_type": "model",
            "created_time": "2016-10-03T02:19:09.000Z",
            "updated_time": "2016-10-03T02:19:09.000Z"
        },
        {
            "project_id": "n003",
            "project_name": "test_project",
            "project_type": "model",
            "created_time": "2016-10-03T02:19:09.000Z",
            "updated_time": "2016-10-03T02:19:09.000Z"
        }
    ];

    $('.projects-container').empty()
    for (var i = 0; i < projects.length; i++) {
        $('.projects-container').append(' <div class="project-wrapper"><div class="row"><div class="col-lg-5 offset-lg-1"><div class="row"><span class="h3 font-weight-bold text-uppercase">' + projects[i].project_name + '</span></div><div class="row" style="padding-top: 5%;margin-bottom:0%"><label>Project ID : ' + projects[i].project_id + '</label></div> <div class="row"> <label>Project Type : ' + projects[i].project_type + '</label></div><div class="row"><label>Last Updated : ' + new Date(projects[i].updated_time).toDateString() + '</label></div></div><div class="col-lg-6" style="padding-top: 5% "><button type="button" class="btn btn-danger col-lg-3 offset-lg-1" style="padding: 1.5% ">Delete</button><button type="button" class="btn btn-info col-lg-3 offset-lg-1" style="padding: 1.5% ">Clone</button><button type="button" data-toggle="modal" data-target="#snapshots-modal" class="btn btn-success col-lg-3 offset-lg-1" style="padding: 1.5%" id="' + projects[i].project_id + '">Open</button></div></div></div>');

        $('#' + projects[i].project_id).click(function () {
            // $.ajax({
            //     url: "http://localhost:8083/api/snapshots/projects/" + this.id,
            //     crossDomain: true
            // }).done(function (snpsts) {
            //
            //
            //
            // });
            snapshots = [
                {
                    "snapshot_id": "none",
                    "project_name": "test_project",
                    "project_type": "model"
                },
                {
                    "snapshot_id": "s002",
                    "project_name": "snapshot_in_project",
                    "project_type": "model"
                }
            ]
            $('#snapshots').empty()
            for (var i = 0; i < snapshots.length; i++) {
                $('#snapshots').append('<li><ul class="nav of nav-stacked"><li class="tq">' + snapshots[i].snapshot_id + '</li></ul></li>')
            }

        });

    }


    $('#snapshots-modal').on('shown.bs.modal', function () {


    });


}

$(document).ready(function () {
    load_projects();
})