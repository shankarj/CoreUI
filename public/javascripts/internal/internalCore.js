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


$(document).ready(function () {

})