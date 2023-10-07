$(document).ready(function() {
  var selectedTimes = {};

  $('.date-list').click(function() {
    if (!$(this).hasClass('active-date-list')) {
      $('.date-list').removeClass('active-date-list');
      $(this).addClass('active-date-list');

      var index = $(this).index();
      $('.cta-panel').removeClass('cta-panel-active');
      $('.cta-panel').eq(index).addClass('cta-panel-active');

      var activePanel = $('.cta-panel-active');
      activePanel.find('.cta-panel-event-button').removeClass('cta-panel-event-button-active');
      activePanel.find('.cta-panel-local').removeClass('cta-panel-all-active');
      activePanel.find('.cta-panel-local').removeClass('cta-panel-rotated-left');
      activePanel.find('.cta-panel-local').removeClass('cta-panel-rotated-right');
      activePanel.find('.cta-panel-global').removeClass('cta-panel-all-active');
      activePanel.find('.cta-panel-global').removeClass('cta-panel-rotated-left');
      activePanel.find('.cta-panel-global').removeClass('cta-panel-rotated-right');

      if (selectedTimes.hasOwnProperty(index)) {
        var selectedTime = selectedTimes[index];
        activePanel.find('.cta-panel-event-button:contains(' + selectedTime + ')').addClass('cta-panel-event-button-active');
        activePanel.find('.cta-panel-global:contains(' + selectedTime + ')').addClass('cta-panel-all-active');

        var eventButtonIndex = activePanel.find('.cta-panel-event-button-active').index();
        var activeLocalWrappers = activePanel.find('.cta-panel-local-wrapper');
        activeLocalWrappers.each(function(localIndex) {
          $(this).find('.cta-panel-local').eq(eventButtonIndex).addClass('cta-panel-all-active');

          // Find the role index based on localIndex
          var roleIndex = localIndex % 5;
          var localElements = $(this).find('.cta-panel-local');
          localElements.each(function(localElemIndex) {
            if (localElemIndex < eventButtonIndex) {
              $(this).addClass('cta-panel-rotated-left');
            } else if (localElemIndex > eventButtonIndex) {
              $(this).addClass('cta-panel-rotated-right');
            }
          });
        });

        var activeGlobalWrappers = activePanel.find('.cta-panel-global-wrapper');
        activeGlobalWrappers.each(function(globalIndex) {
          var globalElements = $(this).find('.cta-panel-global');
          globalElements.each(function(globalElemIndex) {
            if (globalElemIndex < eventButtonIndex) {
              $(this).addClass('cta-panel-rotated-left');
            } else if (globalElemIndex > eventButtonIndex) {
              $(this).addClass('cta-panel-rotated-right');
            }
          });
        });
      } else {
        var firstEventButton = activePanel.find('.cta-panel-event-button').first();
        firstEventButton.addClass('cta-panel-event-button-active');
        var buttonIndex = firstEventButton.index();
        var activeLocalWrappers = activePanel.find('.cta-panel-local-wrapper');
        activeLocalWrappers.each(function(localIndex) {
          $(this).find('.cta-panel-local').eq(buttonIndex).addClass('cta-panel-all-active');

          // Find the role index based on localIndex
          var roleIndex = localIndex % 5;
          var localElements = $(this).find('.cta-panel-local');
          localElements.each(function(localElemIndex) {
            if (localElemIndex > buttonIndex) {
              $(this).addClass('cta-panel-rotated-right');
            }
          });
        });

        var activeGlobalWrappers = activePanel.find('.cta-panel-global-wrapper');
        activeGlobalWrappers.each(function(globalIndex) {
          var globalElements = $(this).find('.cta-panel-global');
          globalElements.each(function(globalElemIndex) {
            if (globalElemIndex > buttonIndex) {
              $(this).addClass('cta-panel-rotated-right');
            }
          });
        });

        activePanel.find('.cta-panel-global').eq(buttonIndex).addClass('cta-panel-all-active');
        selectedTimes[index] = firstEventButton.text();
      }
    }
  });

  $('.cta-panel-event-button').click(function() {
    $('.cta-panel-event-button').removeClass('cta-panel-event-button-active');
    $(this).addClass('cta-panel-event-button-active');

    $('.cta-panel-local').removeClass('cta-panel-all-active');
    $('.cta-panel-global').removeClass('cta-panel-all-active');
    $('.cta-panel-local').removeClass('cta-panel-rotated-left');
    $('.cta-panel-local').removeClass('cta-panel-rotated-right');
    $('.cta-panel-global').removeClass('cta-panel-rotated-left');
    $('.cta-panel-global').removeClass('cta-panel-rotated-right');

    var buttonIndex = $(this).index();
    var activeDateIndex = $('.date-list.active-date-list').index();
    
    var activePanel = $(this).closest('.cta-panel');
    activePanel.find('.cta-panel-global').eq(buttonIndex).addClass('cta-panel-all-active');
    var activeLocalWrappers = activePanel.find('.cta-panel-local-wrapper');
    activeLocalWrappers.each(function(localIndex) {
      $(this).find('.cta-panel-local').eq(buttonIndex).addClass('cta-panel-all-active');

      // Find the role index based on localIndex
      var roleIndex = localIndex % 5;
      var localElements = $(this).find('.cta-panel-local');
      localElements.each(function(localElemIndex) {
        if (localElemIndex < buttonIndex) {
          $(this).addClass('cta-panel-rotated-left');
        } else if (localElemIndex > buttonIndex) {
          $(this).addClass('cta-panel-rotated-right');
        }
      });
    });

    var activeGlobalWrappers = activePanel.find('.cta-panel-global-wrapper');
    activeGlobalWrappers.each(function(globalIndex) {
      var globalElements = $(this).find('.cta-panel-global');
      globalElements.each(function(globalElemIndex) {
        if (globalElemIndex < buttonIndex) {
          $(this).addClass('cta-panel-rotated-left');
        } else if (globalElemIndex > buttonIndex) {
          $(this).addClass('cta-panel-rotated-right');
        }
      });
    });

    selectedTimes[activeDateIndex] = $(this).text();
  });
});

function redirectToDiscord() {
  window.location.href = "https://discord.gg/s9wsPqmZfw";
}

function logout() {
  window.location.href = "/logout";
}
function auth() {
  window.location.href = "https://discord.com/api/oauth2/authorize?client_id=1123714909356687360&redirect_uri=https%3A%2F%2Fimpactium.fun%2F&response_type=code&scope=identify";
}
function userinfo(userId) {
  window.location.href = '/user/' + userId;
}
function cta(userId, isMember) {
  window.location.href = "/cards/cta";
}    
function admin() {
  window.location.href = "/admin";
}
function moder() {
  window.location.href = "/moder";
}
function raidleader() {
  window.location.href = "/raidleader";
}
function redirectToBuilds() {
  window.location.href = "https://docs.google.com/spreadsheets/d/1P5LYlYfpiwhlNalm4sijqeH7RUpKlnSreFfH91H6LhU/edit#gid=368693401";
}
function regear() {
  window.location.href = "/cards/regear";
}
