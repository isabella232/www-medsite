var Base, BaseClient, BaseMaps, BinaryChannel, FormMatch, Hydra, HydraRTC, Maps, OnMatch, TextChannel, ToggleChoice, Utils, add_i18n_fr, callbacks, chat, file_receiver, files, lat_lng, make_custom_plugins, make_progress, state,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

window.onerror = function(errmsg, url, lno, column, err) {
  var error;
  if (errmsg instanceof Object) {
    return;
  }
  error = errmsg + " on " + url + " at " + lno + ":" + column + ".";
  if ((err != null ? err.stack : void 0) != null) {
    error += '\n' + err.stack;
  }
  if (lno && !/maps\.gstatic\.com/.test(error) && !/maps\.googleapis\.com/.test(error)) {
    $.post('/error', {
      error: error
    });
  }
  return false;
};

OnMatch = {};

Base = (function() {
  function Base(match) {
    this.log(match.get(0), "-> Init");
  }

  Base.prototype.group_log = function(msg, collapsed) {
    if (msg == null) {
      msg = null;
    }
    if (collapsed == null) {
      collapsed = false;
    }
    if (!window.hydra.debug) {
      return;
    }
    if (collapsed) {
      return typeof console !== "undefined" && console !== null ? typeof console.groupCollapsed === "function" ? console.groupCollapsed(msg) : void 0 : void 0;
    } else {
      return typeof console !== "undefined" && console !== null ? typeof console.group === "function" ? console.group(msg) : void 0 : void 0;
    }
  };

  Base.prototype.ungroup_log = function() {
    if (!window.hydra.debug) {
      return;
    }
    return typeof console !== "undefined" && console !== null ? typeof console.groupEnd === "function" ? console.groupEnd() : void 0 : void 0;
  };

  Base.prototype.log = function() {
    var base, log_args, name;
    if (!window.hydra.debug) {
      return;
    }
    name = this.constructor.name;
    log_args = ["[" + name + "]"].concat(Array.prototype.slice.call(arguments, 0));
    return typeof console !== "undefined" && console !== null ? typeof (base = console.log).apply === "function" ? base.apply(console, log_args) : void 0 : void 0;
  };

  if ($.magnificPopup != null) {
    $.extend(true, $.magnificPopup.defaults, {
      tClose: 'Fermer (Esc)',
      mainClass: 'mfp-move-from-top',
      removalDelay: 500,
      tLoading: 'Chargement â€¦',
      callbacks: {
        open: function() {
          return $('.mfp-content').children().addClass('white-popup mfp-with-anim');
        },
        ajaxContentAdded: function() {
          return $('.mfp-content').children().addClass('white-popup mfp-with-anim');
        }
      }
    });
    $.magnificPopup.instance._onFocusIn = function(e) {
      if ($(e.target).hasClass('ui-datepicker-month')) {
        return true;
      }
      if ($(e.target).hasClass('ui-datepicker-year')) {
        return true;
      }
      return $.magnificPopup.proto._onFocusIn.call(this, e);
    };
  }

  if ($.spectrum != null) {
    $.extend($.fn.spectrum.defaults, {
      cancelText: "Annuler",
      chooseText: "Valider",
      clearText: "Effacer couleur sélectionné",
      noColorSelectedText: "Aucune couleur sélectionnée",
      togglePaletteMoreText: "Plus",
      togglePaletteLessText: "Moins"
    });
  }

  return Base;

})();

Hydra = (function(superClass) {
  extend(Hydra, superClass);

  function Hydra() {
    this.components = [];
  }

  Hydra.prototype.register_utils = function() {
    return this.utils = new Utils('/static/images/mark-medsite.png');
  };

  Hydra.prototype.start = function() {
    var cls, component, e, error1, j, len1, name, ref, results1;
    this.group_log("Hydra startup", true);
    for (name in OnMatch) {
      cls = OnMatch[name];
      try {
        $(cls.prototype.match).each((function(_this) {
          return function(i, e) {
            return _this.components.push(new cls($(e)));
          };
        })(this));
      } catch (error1) {
        e = error1;
        if (typeof console !== "undefined" && console !== null) {
          if (typeof console.error === "function") {
            console.error(e);
          }
        }
        if (window.hydra.debug) {
          throw e;
        }
      }
    }
    this.ungroup_log();
    ref = this.components;
    results1 = [];
    for (j = 0, len1 = ref.length; j < len1; j++) {
      component = ref[j];
      results1.push(typeof component.ready === "function" ? component.ready() : void 0);
    }
    return results1;
  };

  Hydra.prototype.restart = function(cls) {
    var component, e, error1, j, len1, new_components;
    this.group_log("Hydra restart " + cls.prototype.constructor.name, true);
    new_components = [];
    try {
      $(cls.prototype.match).each(function(i, e) {
        return new_components.push(new cls($(e)));
      });
    } catch (error1) {
      e = error1;
      if (typeof console !== "undefined" && console !== null) {
        if (typeof console.error === "function") {
          console.error(e);
        }
      }
      if (window.hydra.debug) {
        throw e;
      }
    }
    this.ungroup_log();
    for (j = 0, len1 = new_components.length; j < len1; j++) {
      component = new_components[j];
      if (typeof component.ready === "function") {
        component.ready();
      }
    }
    return this.components = this.components.concat(new_components);
  };

  return Hydra;

})(Base);

this.hydra = new Hydra();

$((function(_this) {
  return function() {
    return setTimeout(function() {
      return _this.hydra.start();
    }, 10);
  };
})(this));

OnMatch.Ga = (function(superClass) {
  extend(Ga, superClass);

  Ga.prototype.match = '.track-ga';

  function Ga($link1) {
    this.$link = $link1;
    Ga.__super__.constructor.apply(this, arguments);
    this.$link.on('click', function(e) {
      var ga_type;
      ga_type = $(e.target).attr('data-type-ga') || 'Download';
      return _gaq.push(['_trackEvent', $(e.target).attr('data-title-ga'), ga_type]);
    });
  }

  return Ga;

})(Base);

OnMatch.Fast = (function(superClass) {
  extend(Fast, superClass);

  Fast.prototype.match = '.fast';

  function Fast($section1) {
    this.$section = $section1;
    Fast.__super__.constructor.apply(this, arguments);
    this.$field = $("#fast_filter", this.$section);
    this.$column = $("#fast_column", this.$section);
    this.$placehldr = $("#fast_placeholder");
    this.requestIndex = 0;
    this.query = this.$section.attr('data-query');
    this.$field.on('input', this.search.bind(this));
    this.$column.change(this.search.bind(this));
    $('form', this.$section).submit(function() {
      return false;
    });
  }

  Fast.prototype.search = function() {
    var column_name, val, xhr;
    val = this.$field.val();
    if (!val) {
      return;
    }
    column_name = this.$column.val();
    if (column_name) {
      val = column_name + ":" + val;
    }
    this.$placehldr.html('<div class="loader"> <div class="circle one"></div> <div class="circle two"></div> <div class="circle three"></div> </div>');
    if (typeof xhr !== "undefined" && xhr !== null) {
      xhr.abort();
    }
    return xhr = $.ajax({
      url: this.query.replace('query', encodeURIComponent(val)),
      dataType: "text",
      rqIndex: ++this.requestIndex,
      data: {},
      traditional: true,
      success: (function(_this) {
        return function(data) {
          if ( this .rqIndex === _this.requestIndex) {
            _this.$placehldr.html(data);
            return _this.$placehldr.trigger("after_insert");
          }
        };
      })(this),
      error: (function(_this) {
        return function() {
          if ( this .rqIndex === _this.requestIndex) {
            return _this.$placehldr.html("");
          }
        };
      })(this)
    });
  };

  return Fast;

})(Base);

lat_lng = function(latlng) {
  if (latlng instanceof Array) {
    return new google.maps.LatLng(latlng[0], latlng[1]);
  } else {
    return new google.maps.LatLng(latlng.lat, latlng.lng);
  }
};

Maps = {};

BaseMaps = (function() {
  function BaseMaps() {}

  BaseMaps.prototype.zoom = 6;

  BaseMaps.prototype.center = {
    lat: 47,
    lng: 1
  };

  BaseMaps.prototype.ready = function(map) {
    this.map = map;
    return $.getJSON(map.$map.attr('data-load'), this.load.bind(this));
  };

  BaseMaps.prototype.load = function(data) {
    return this.map.add_client_markers(data.data);
  };

  return BaseMaps;

})();

Maps.ClientAdmin = (function(superClass) {
  extend(ClientAdmin, superClass);

  function ClientAdmin() {
    return ClientAdmin.__super__.constructor.apply(this, arguments);
  }

  return ClientAdmin;

})(BaseMaps);

Maps.Cartography = (function(superClass) {
  extend(Cartography, superClass);

  function Cartography() {
    return Cartography.__super__.constructor.apply(this, arguments);
  }

  Cartography.prototype.ready = function(map) {
    Cartography.__super__.ready.apply(this, arguments);
    return $('.mapjump').click(function() {
      var id;
      id = +$(this).closest('tr').attr('id').replace('client', '');
      return new google.maps.event.trigger(map.client_markers[id], 'click');
    });
  };

  return Cartography;

})(BaseMaps);

BaseClient = (function(superClass) {
  extend(BaseClient, superClass);

  function BaseClient() {
    return BaseClient.__super__.constructor.apply(this, arguments);
  }

  BaseClient.prototype.load = function(data) {
    if (data.style) {
      this.map.style(data.style);
    }
    this.map.map.setZoom(16);
    if (data.client.latlng) {
      return this.map.map.panTo(lat_lng(data.client.latlng));
    }
  };

  return BaseClient;

})(BaseMaps);

Maps.MedsiteMap = (function(superClass) {
  extend(MedsiteMap, superClass);

  function MedsiteMap() {
    return MedsiteMap.__super__.constructor.apply(this, arguments);
  }

  MedsiteMap.prototype.ready = function(map) {
    var latlng;
    this.map = map;
    this.map.map.setZoom(15);
    latlng = new google.maps.LatLng(45.776999, 4.859773);
    this.map.map.setCenter(latlng);
    this.map.add_info_marker(latlng, 'Medsite - Kozea', '<big>Medsite - Kozea</big><br>107 bd Stalingrad<br>69100 Villeurbanne', hydra.utils.static_url_for("images/map/mark-medsite.png"));
    return $.getJSON(map.$map.attr('data-load'), this.load.bind(this));
  };

  MedsiteMap.prototype.load = function(data) {
    return this.map.style(data.style);
  };

  return MedsiteMap;

})(BaseMaps);

Maps.Widget = (function(superClass) {
  extend(Widget, superClass);

  function Widget() {
    return Widget.__super__.constructor.apply(this, arguments);
  }

  Widget.prototype.load = function(data) {
    this.map.add_client_marker(data.client);
    return Widget.__super__.load.apply(this, arguments);
  };

  return Widget;

})(BaseClient);

Maps.Client = (function(superClass) {
  extend(Client, superClass);

  function Client() {
    return Client.__super__.constructor.apply(this, arguments);
  }

  Client.prototype.load = function(data) {
    this.map.add_client_marker(data.client);
    Client.__super__.load.apply(this, arguments);
    if (data.client.latlng) {
      return this.map.add_direction_to(data.client.latlng);
    }
  };

  return Client;

})(BaseClient);

Maps.SearchMap = (function(superClass) {
  extend(SearchMap, superClass);

  function SearchMap() {
    return SearchMap.__super__.constructor.apply(this, arguments);
  }

  SearchMap.prototype.load = function(data) {
    this.map.add_client_markers(data.data);
    if (data.data_patientorder) {
      this.map.add_client_markers(data.data_patientorder);
    }
    if (data.data_ecommerce) {
      this.map.add_client_markers(data.data_ecommerce);
    }
    this.map.center_to_geolocation();
    this.map.result.on('click', '.client-list dt', (function(_this) {
      return function(e) {
        var $dd, $dt, id, marker;
        $dt = $(e.currentTarget);
        id = $dt.attr('data-id');
        $dd = $("dd[data-id=" + id + "]");
        $dd.find('img').attr("src", $dd.find('img').attr("data-src"));
        $(".client-list dd:visible:not([data-id=" + id + "])").slideToggle();
        $(".client-list dt:not([data-id=" + id + "]) span.close").toggleClass('close');
        $dd.slideToggle();
        $dt.find('span').toggleClass('close');
        marker = _this.map.client_markers[id];
        if (!$dt.find('span').hasClass('close')) {
          marker.info.close();
          return _this.map.marker_open_id = null;
        } else {
          _this.map.marker_open_id = id;
          return _this.map.open_marker(marker);
        }
      };
    })(this));
    return this.map.monitor_client_marker_visibility(((function(_this) {
      return function(ids) {
        var $dtdd, id, j, len1, marker_index, ref, results1;
        $dtdd = $(".client-list dt,.client-list dd");
        $dtdd.hide();
        if (_this.map.marker_open_id && (ref = parseInt(_this.map.marker_open_id), indexOf.call(ids, ref) >= 0)) {
          $("dt[data-id=" + _this.map.marker_open_id + "], dd[data-id=" + _this.map.marker_open_id + "]").show();
          marker_index = ids.indexOf(_this.map.marker_open_id);
          ids.splice(marker_index, 1);
        }
        results1 = [];
        for (j = 0, len1 = ids.length; j < len1; j++) {
          id = ids[j];
          results1.push($("dt[data-id=" + id + "]").show());
        }
        return results1;
      };
    })(this)));
  };

  return SearchMap;

})(BaseMaps);

Maps.Theme = (function(superClass) {
  extend(Theme, superClass);

  function Theme() {
    return Theme.__super__.constructor.apply(this, arguments);
  }

  Theme.prototype.first = null;

  Theme.prototype.ready = function(map) {
    if (!Maps.Theme.prototype.first) {
      Maps.Theme.prototype.first = map;
    } else {
      map.map.bindTo('center', Maps.Theme.prototype.first.map);
      map.map.bindTo('zoom', Maps.Theme.prototype.first.map);
    }
    return Theme.__super__.ready.apply(this, arguments);
  };

  return Theme;

})(Maps.Widget);

Maps.EditCoords = (function(superClass) {
  extend(EditCoords, superClass);

  function EditCoords() {
    return EditCoords.__super__.constructor.apply(this, arguments);
  }

  EditCoords.prototype.load = function(data) {
    this.map.add_edit_marker(data.client.latlng);
    return EditCoords.__super__.load.apply(this, arguments);
  };

  return EditCoords;

})(BaseClient);

callbacks = [];

state = 0;

window.GMapsLoaded = function() {
  var callback, j, len1;
  state = 2;
  for (j = 0, len1 = callbacks.length; j < len1; j++) {
    callback = callbacks[j];
    callback();
  }
  callbacks = null;
  return state = 3;
};

OnMatch.Map = (function(superClass) {
  extend(Map, superClass);

  Map.prototype.match = '.map-wrapper';

  function Map($map1) {
    this.$map = $map1;
    this.search = bind(this.search, this);
    this.search_timeout = bind(this.search_timeout, this);
    Map.__super__.constructor.apply(this, arguments);
    if (state === 0) {
      state = 1;
      $('body').append($('<script>', {
        src: 'https://maps.googleapis.com/maps/api/js?' + 'v=3.exp&sensor=false&language=fr&callback=GMapsLoaded'
      }));
    }
    this.conf = this.$map.attr('data-conf');
    this._conf = new Maps[this.conf]();
    this.zoom = this._conf.zoom;
    this.center = this._conf.center;
    this.nocontrol = this._conf.nocontrol || false;
    this.directionsDisplay = null;
    this.circle = null;
    this.client_markers = {};
    if (state >= 2) {
      this.init();
    } else {
      callbacks.push(this.init.bind(this));
    }
    $('body').on('map-refresh', this.refresh.bind(this));
    this.requestIndex = 0;
    this.has_search = false;
    this.search_input = $("#search_pharma");
    this.search_col = $("#search_col");
    this.result = $("#pharma_results");
    if (this.$map.attr('data-submit') === 'disable') {
      $('form').on('submit', function(e) {
        return e.preventDefault();
      });
    }
    this.search_input.on('input', this.search_timeout.bind(this));
    this.search_col.on('change', this.search_timeout.bind(this));
  }

  Map.prototype.search_timeout = function() {
    if (this.search_timeout) {
      clearTimeout(this.search_timeout);
    }
    return this.search_timeout = setTimeout(this.search, 300);
  };

  Map.prototype.init = function() {
    this.map = new google.maps.Map(this.$map.get(0), {
      zoom: this.zoom,
      center: lat_lng(this.center),
      disableDefaultUI: this.nocontrol || void 0
    });
    return this._conf.ready(this);
  };

  Map.prototype.refresh = function() {
    return typeof google !== "undefined" && google !== null ? new google.maps.event.trigger(this.map, 'resize') : void 0;
  };

  Map.prototype.style = function(theme) {
    var name;
    if (!theme) {
      return;
    }
    name = Math.random().toString();
    this.map.mapTypes.set(name, new google.maps.StyledMapType(JSON.parse(theme)));
    return this.map.setMapTypeId(name);
  };

  Map.prototype.open_marker = function(marker) {
    var id, other_marker, ref;
    ref = this.client_markers;
    for (id in ref) {
      other_marker = ref[id];
      other_marker.info.close();
    }
    return marker.info.open(this.map, marker);
  };

  Map.prototype.add_info_marker = function(latlng, title, info, icon) {
    var marker;
    marker = new google.maps.Marker({
      position: latlng,
      map: this.map,
      title: title,
      icon: icon ? icon : void 0
    });
    if (info) {
      marker.info = new google.maps.InfoWindow({
        content: info
      });
    }
    google.maps.event.addListener(marker, 'click', (function(_this) {
      return function() {
        return _this.open_marker(marker);
      };
    })(this));
    google.maps.event.addListener(marker, 'dblclick', (function(_this) {
      return function() {
        _this.map.setZoom(16);
        return _this.map.panTo(latlng);
      };
    })(this));
    return marker;
  };

  Map.prototype.add_edit_marker = function(latlng) {
    var edit_marker;
    edit_marker = new google.maps.Marker({
      position: lat_lng(latlng),
      map: this.map,
      title: 'Déplacez-moi !',
      draggable: true
    });
    return google.maps.event.addListener(edit_marker, 'drag', function(e) {
      $('#lat').val(e.latLng.lat());
      return $('#lng').val(e.latLng.lng());
    });
  };

  Map.prototype.add_direction_to = function(target) {
    if (navigator.geolocation) {
      return navigator.geolocation.watchPosition((function(_this) {
        return function(position) {
          var directionsService, pos, suppressMarkers;
          pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          if (_this.circle) {
            _this.circle.setMap(null);
          }
          if (_this.directionsDisplay) {
            _this.directionsDisplay.setMap(null);
            _this.directionsDisplay.set('directions', null);
          }
          _this.circle = new google.maps.Circle({
            center: pos,
            radius: position.coords.accuracy,
            map: _this.map,
            fillColor: 'blue',
            fillOpacity: .05,
            strokeColor: 'blue',
            strokeOpacity: .2
          });
          _this.directionsDisplay = new google.maps.DirectionsRenderer({
            suppressInfoWindows: true
          }, suppressMarkers = false, {
            draggable: true
          });
          if ($('.map-directions').length !== 0) {
            _this.directionsDisplay.setPanel($('.map-directions').get(0));
          }
          _this.directionsDisplay.setMap(_this.map);
          directionsService = new google.maps.DirectionsService();
          return directionsService.route({
            origin: pos,
            destination: lat_lng(target),
            travelMode: google.maps.TravelMode.DRIVING
          }, function(response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
              return _this.directionsDisplay.setDirections(response);
            }
          });
        };
      })(this));
    }
  };

  Map.prototype.client_marker_info = function(client) {
    var t;
    t = "<strong>";
    if (client.url) {
      t += "<a href=\"" + client.url + "\">";
    }
    if (client.type) {
      t += "<img src=\"" + (hydra.utils.static_url_for('images/logo/favicon-' + client.type + '.png')) + "\" /> ";
    }
    t += client.title;
    if (client.url) {
      t += "</a>";
    }
    t += "</strong>";
    if (client.url) {
      if (client.service_type) {
        switch (client.service_type) {
          case 'ecommerce':
            t += "<a class=\"patientorder_client\" href=\"" + client.url_patientorder + "\">Réserver votre ordonnance en ligne.</a>";
            t += "<a class=\"ecommerce_client\" href=\"" + client.url_ecommerce + "\">Accéder Ã  la vente en ligne.</a>";
            break;
          case 'patientorder':
            t += "<a class=\"patientorder_client\" href=\"" + client.url_patientorder + "\">Réserver votre ordonnance en ligne.</a>";
            break;
          default:
            t += "<p>Cette pharmacie ne dispose pas de service de réservation en ligne</p>";
        }
      }
    }
    if (client.address) {
      return t = t + "<p>" + client.address + "</p>";
    }
  };

  Map.prototype.add_client_markers = function(clients) {
    var client, j, len1, marker, ref, results1;
    results1 = [];
    for (j = 0, len1 = clients.length; j < len1; j++) {
      client = clients[j];
      if (!client.latlng) {
        continue;
      }
      marker = this.add_info_marker(lat_lng(client.latlng), client.title, this.client_marker_info(client), (client.service_type && ((ref = client.service_type) === 'ecommerce' || ref === 'patientorder') ? hydra.utils.static_url_for("images/map/mark-" + client.type + "_" + client.service_type + ".png") : hydra.utils.static_url_for("images/map/mark-" + client.type + ".png")), hydra.utils.static_url_for("images/map/mark-" + client.type + ".png"));
      if (client.id) {
        results1.push(this.client_markers[client.id] = marker);
      } else {
        results1.push(void 0);
      }
    }
    return results1;
  };

  Map.prototype.add_client_marker = function(client) {
    if (!client.latlng) {
      this.log('No latlng for ' + client);
      return;
    }
    return this.add_info_marker(lat_lng(client.latlng), client.title, this.client_marker_info(client));
  };

  Map.prototype.center_to_geolocation = function() {
    if (navigator.geolocation) {
      return navigator.geolocation.getCurrentPosition((function(_this) {
        return function(position) {
          _this.map.setZoom(12);
          return _this.map.panTo(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
        };
      })(this));
    }
  };

  Map.prototype.monitor_client_marker_visibility = function(callback) {
    return google.maps.event.addListener(this.map, 'bounds_changed', (function(_this) {
      return function() {
        if (_this.timeout) {
          clearTimeout(_this.timeout);
        }
        return _this.timeout = setTimeout((function() {
          var bounds, id, ids, marker, ref;
          bounds = _this.map.getBounds();
          ids = [];
          ref = _this.client_markers;
          for (id in ref) {
            marker = ref[id];
            if (bounds.contains(marker.getPosition())) {
              ids.push(+id);
            }
          }
          return callback(ids);
        }), 500);
      };
    })(this));
  };

  Map.prototype.search = function() {
    var ref, terms;
    terms = (this.search_col.val()) + ":" + (this.search_input.val());
    if (this.search_col.val() === 'location') {
      if (this.search_input.val().length) {
        this.$map.spin();
        new google.maps.Geocoder().geocode({
          'address': this.search_input.val() + ' France'
        }, (function(_this) {
          return function(results, status) {
            var bounds, id, marker, ref;
            if (status === 'OK') {
              bounds = new google.maps.LatLngBounds(results[0].geometry.viewport.getSouthWest(), results[0].geometry.viewport.getNorthEast());
              _this.map.fitBounds(bounds);
              _this.map.panToBounds(bounds);
            } else {
              _this.map.setCenter(new google.maps.LatLng(46.22, 2.21));
              _this.map.setZoom(5);
            }
            ref = _this.client_markers;
            for (id in ref) {
              marker = ref[id];
              marker.setMap(_this.map);
            }
            return _this.$map.spin(false);
          };
        })(this));
      } else {
        this.map.setCenter(new google.maps.LatLng(46.22, 2.21));
        this.map.setZoom(5);
      }
      if (!this.has_search) {
        return;
      }
      terms = "location:";
    }
    if (this.search_input.val().length) {
      this.has_search = true;
    } else {
      if (!this.has_search) {
        return;
      }
      this.has_search = false;
    }
    this.map.setCenter(new google.maps.LatLng(46.22, 2.21));
    this.map.setZoom(5);
    terms = (this.search_col.val()) + ":" + (this.search_input.val());
    this.$map.spin();
    if ((ref = this.xhr) != null) {
      ref.abort();
    }
    return this.xhr = $.ajax({
      url: this.search_input.data('url'),
      dataType: "json",
      type: 'POST',
      rqIndex: ++this.requestIndex,
      data: {
        terms: terms
      },
      traditional: true,
      success: (function(_this) {
        return function(response) {
          var client, id, j, len1, marker, ref1, ref2;
          if ( this .rqIndex !== _this.requestIndex) {
            return;
          }
          _this.$map.spin(false);
          ref1 = _this.client_markers;
          for (id in ref1) {
            marker = ref1[id];
            marker.setMap(null);
            marker.info.close();
          }
          if (response.data) {
            ref2 = response.data;
            for (j = 0, len1 = ref2.length; j < len1; j++) {
              client = ref2[j];
              _this.client_markers[client.id].setMap(_this.map);
            }
          }
          return _this.result.html(response.results);
        };
      })(this)
    });
  };

  return Map;

})(Base);

OnMatch.MoreLess = (function(superClass) {
  extend(MoreLess, superClass);

  MoreLess.prototype.match = '.more,.less';

  function MoreLess($thing) {
    this.$thing = $thing;
    MoreLess.__super__.constructor.apply(this, arguments);
    this.done = true;
    if (this.$thing.closest('.widget').length === 0) {
      this.$thing.on("click", this.toggle.bind(this));
    }
  }

  MoreLess.prototype.toggle = function(event) {
    var $details, $more_less;
    if (!this.done) {
      return;
    }
    this.done = false;
    $more_less = $(event.target);
    $details = $more_less.parent().find(".details");
    if ($details.is(":visible")) {
      $details.slideUp();
      return $more_less.parent().find(".less").fadeOut(200, (function(_this) {
        return function() {
          return $more_less.parent().find(".more").fadeIn(200, function() {
            return _this.done = true;
          });
        };
      })(this));
    } else {
      $details.slideDown();
      return $more_less.parent().find(".more").fadeOut(200, (function(_this) {
        return function() {
          return $more_less.parent().find(".less").fadeIn(200, function() {
            return _this.done = true;
          });
        };
      })(this));
    }
  };

  return MoreLess;

})(Base);

OnMatch.Responsive = (function(superClass) {
  extend(Responsive, superClass);

  Responsive.prototype.match = 'main';

  function Responsive($fancy) {
    this.$fancy = $fancy;
    Responsive.__super__.constructor.apply(this, arguments);
    window.responsive = this;
    this.sizes = ['sm', 'md', 'lg', 'xl', 'xxl'];
    this.sm = 35.5;
    this.md = 48;
    this.lg = 64;
    this.xl = 80;
    this.$body = $('body');
    $(window).on('resize', this.resize.bind(this));
  }

  Responsive.prototype.ready = function() {
    return $(window).trigger('resize');
  };

  Responsive.prototype.get_size = function() {
    return $('.marker:visible').attr('data-size') || 'xxl';
  };

  Responsive.prototype.resize = function() {
    var i, j, new_size, old_size, ref, ref1, responsive_event, results1, size;
    new_size = this.get_size();
    old_size = this.size;
    if (new_size === old_size) {
      return;
    }
    if (typeof console !== "undefined" && console !== null) {
      console.log("[Responsive] " + old_size + " -> " + new_size);
    }
    results1 = [];
    for (i = j = ref = this.sizes.indexOf(old_size), ref1 = this.sizes.indexOf(new_size); ref <= ref1 ? j <= ref1 : j >= ref1; i = ref <= ref1 ? ++j : --j) {
      size = this.sizes[i];
      if (size === old_size) {
        continue;
      }
      responsive_event = $.Event('responsive');
      responsive_event.old = this.size;
      responsive_event["new"] = size;
      if (typeof console !== "undefined" && console !== null) {
        console.log(this.size + " -> " + size);
      }
      this.size = size;
      results1.push(this.$body.trigger(responsive_event));
    }
    return results1;
  };

  return Responsive;

})(Base);

OnMatch.Switch = (function(superClass) {
  extend(Switch, superClass);

  Switch.prototype.match = 'main';

  function Switch($fancy) {
    this.$fancy = $fancy;
    $('body').on('responsive', this.respond.bind(this));
  }

  Switch.prototype.respond = function(e) {
    var $target, j, k, len1, len2, ref, ref1, results1, target;
    ref = $("[data-insert-before-" + e["new"] + "]");
    for (j = 0, len1 = ref.length; j < len1; j++) {
      target = ref[j];
      $target = $(target);
      $target.insertBefore($($target.attr("data-insert-before-" + e["new"])));
    }
    ref1 = $("[data-insert-after-" + e["new"] + "]");
    results1 = [];
    for (k = 0, len2 = ref1.length; k < len2; k++) {
      target = ref1[k];
      $target = $(target);
      results1.push($target.insertAfter($($target.attr("data-insert-after-" + e["new"]))));
    }
    return results1;
  };

  return Switch;

})(Base);

Utils = (function(superClass) {
  extend(Utils, superClass);

  function Utils(static_root) {
    this.static_root = static_root;
  }

  Utils.prototype.static_url_for = function(filename) {
    return this.static_root.replace('hydra_filename_to_replace', filename);
  };

  Utils.prototype.escape_id = function(id) {
    return id.replace(/\./g, '\\.');
  };

  Utils.prototype.money_format = function(toFormat, places) {
    var nbplaces;
    nbplaces = (places != null) || 2;
    return ("" + (toFormat / 100).toFixed(nbplaces)).replace(".", ",") + " â‚¬";
  };

  Utils.prototype.flash = function(messages) {
    var $cat_container, $message_container, cat_messages, category, j, len1, message, results1, title, titles;
    titles = {
      info: "Information",
      message: "Information",
      missing: "Champ manquant",
      error: "Erreur"
    };
    $message_container = $(".messages");
    $message_container.html("");
    results1 = [];
    for (category in messages) {
      cat_messages = messages[category];
      title = titles[category];
      $cat_container = $("<div>", {
        "class": "message " + category
      }).append($("<h3>").text(title));
      for (j = 0, len1 = cat_messages.length; j < len1; j++) {
        message = cat_messages[j];
        $cat_container.append($("<p>").text(message));
      }
      $message_container.append($cat_container);
      results1.push(setTimeout((function() {
        return $cat_container.remove();
      }), 5000));
    }
    return results1;
  };

  Utils.prototype.absolute_top = function($elt) {
    var top;
    top = $elt.offset().top;
    top += parseInt($("html").css("border-top-width"), 10) || 0;
    top += parseInt($("body").css("border-top-width"), 10) || 0;
    if (indexOf.call(document.documentElement.style, 'WebkitAppearance') < 0) {
      top -= parseInt($("html").css("padding-top"), 10) || 0;
    }
    return top;
  };

  Utils.prototype.absolute_left = function($elt) {
    var left;
    left = $elt.offset().left;
    left += parseInt($("html").css("border-left-width"), 10) || 0;
    left += parseInt($("body").css("border-left-width"), 10) || 0;
    return left;
  };

  Utils.prototype.uuid4 = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r, v;
      r = Math.random() * 16 | 0;
      v = c === 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  };

  Utils.prototype.light_or_dark = function($elt) {
    var brightness, contrast;
    contrast = this.contrast($elt.css('background-color'));
    brightness = contrast ? 'light' : 'dark';
    $elt.removeClass('light dark');
    return $elt.addClass(brightness);
  };

  Utils.prototype.rgb = function(color) {
    var _, b, g, hex, r, rgb;
    rgb = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
    if (rgb) {
      _ = rgb[0], r = rgb[1], g = rgb[2], b = rgb[3];
    } else {
      hex = +("0x" + color.slice(1).replace(color.length < 5 && /./g, '$&$&'));
      r = hex >> 16;
      g = hex >> 8 & 255;
      b = hex & 255;
    }
    return [r, g, b];
  };

  Utils.prototype.contrast = function(color) {
    var b, g, r, ref;
    ref = this.rgb(color), r = ref[0], g = ref[1], b = ref[2];
    return (299 * r + 587 * g + 114 * b) / 1000 > 128;
  };

  Utils.prototype.invert = function(color) {
    var b, g, r, ref;
    ref = this.rgb(color), r = ref[0], g = ref[1], b = ref[2];
    return "rgb(" + (255 - r) + ", " + (255 - g) + ", " + (255 - b) + ")";
  };

  return Utils;

})(Base);

$.fn.html5_data = (function() {
  var data, data_name, j, len1, name;
  data_name = $.map($(this).data(), function(falsy_value, name) {
    return name;
  });
  data = {};
  for (j = 0, len1 = data_name.length; j < len1; j++) {
    name = data_name[j];
    data[name] = $(this).attr("data-" + name);
  }
  return data;
});

$.fn.serializeObject = (function() {
  var form_object, input, j, len1, ref;
  form_object = {};
  ref = $(this).serializeArray();
  for (j = 0, len1 = ref.length; j < len1; j++) {
    input = ref[j];
    form_object[input.name] = input.value;
  }
  return form_object;
});

hydra.register_utils();

OnMatch.Slick = (function(superClass) {
  extend(Slick, superClass);

  Slick.prototype.match = '.slick';

  function Slick($slick) {
    this.$slick = $slick;
    Slick.__super__.constructor.apply(this, arguments);
    this.sel = this.$slick.attr('data-slick-sel') || 'div';
    this.dots = this.$slick.attr('data-slick-dots') && true || false;
    this.arrows = this.$slick.attr('data-slick-arrows') && true || false;
    this.to_show = this.$slick.attr('data-slick-show') || 1;
    this.to_scroll = this.$slick.attr('data-slick-scroll') || 1;
    this.fade = this.$slick.attr('data-fade') && true || false;
    this.speed = this.$slick.attr('data-speed') || 2000;
    this.responsive = [];
    if (this.$slick.attr('data-slick-ecommerce-responsive')) {
      this.responsive = [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1
          }
        }, {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1
          }
        }, {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ];
    }
    if (!(this.$slick.find(this.sel).length > 1)) {
      return;
    }
  }

  Slick.prototype.ready = function() {
    return this.$slick.slick({
      autoplay: true,
      dots: this.dots,
      arrows: this.arrows,
      slide: this.sel,
      autoplaySpeed: this.speed,
      centerMode: 1,
      fade: this.fade,
      cssEase: 'linear',
      slidesToShow: parseInt(this.to_show),
      slidesToScroll: parseInt(this.to_scroll),
      responsive: this.responsive
    });
  };

  return Slick;

})(Base);

OnMatch.Slide = (function(superClass) {
  extend(Slide, superClass);

  Slide.prototype.match = '[data-toggle-slide]';

  function Slide($button1) {
    this.$button = $button1;
    Slide.__super__.constructor.apply(this, arguments);
    if (this.$button.attr('data-root')) {
      this.$togglable = this.$button.closest(this.$button.attr('data-root')).find(this.$button.attr('data-toggle-slide'));
    } else {
      this.$togglable = $(this.$button.attr('data-toggle-slide'));
    }
    this.$button.on('click', this.toggle.bind(this));
    this.inanim = this.$togglable.attr('data-in');
    this.outanim = this.$togglable.attr('data-out');
  }

  Slide.prototype.toggle = function() {
    if (!this.$togglable.hasClass(this.inanim)) {
      this.$button.addClass('open');
      this.$togglable.removeClass("hidden " + this.outanim);
      return this.$togglable.addClass("animated " + this.inanim);
    } else {
      this.$togglable.removeClass(this.inanim);
      this.$togglable.addClass("animated " + this.outanim);
      this.$button.removeClass('open');
      return this.$togglable.on('animationend webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend', (function(_this) {
        return function() {
          _this.$togglable.addClass('hidden');
          return _this.$togglable.off('animationend webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend');
        };
      })(this));
    }
  };

  return Slide;

})(Base);

add_i18n_fr = function() {
  return window.tinymce.addI18n("fr_FR", {
    Cut: "Couper",
    "Header 2": "Titre 2",
    "Your browser doesn't support direct access to the clipboard. Please use the Ctrl+X/C/V keyboard shortcuts instead.": "Votre navigateur ne supporte pas la copie directe. Merci d'utiliser les touches Ctrl+X/C/V.",
    Div: "Div",
    Paste: "Coller",
    Close: "Fermer",
    "Font Family": "Polices de caractÃ¨res",
    Pre: "Pre",
    "Align right": "Aligner Ã  droite",
    "New document": "Nouveau document",
    Blockquote: "Citation",
    "Numbered list": "Numérotation",
    "Increase indent": "Augmenter le retrait",
    Formats: "Formats",
    Headers: "Titres",
    "Select all": "Tout sélectionner",
    "Header 3": "Titre 3",
    Blocks: "Blocs",
    Undo: "Annuler",
    Strikethrough: "Barré",
    "Bullet list": "Puces",
    "Header 1": "Titre 1",
    Superscript: "Exposant",
    "Clear formatting": "Effacer la mise en forme",
    "Font Sizes": "Tailles de la police",
    Subscript: "Indice",
    "Header 6": "Titre 6",
    Redo: "Rétablir",
    Paragraph: "Paragraphe",
    Ok: "Ok",
    Bold: "Gras",
    Code: "Code",
    Italic: "Italique",
    "Align center": "Aligner au centre",
    "Header 5": "Titre 5",
    "Decrease indent": "Diminuer le retrait",
    "Header 4": "Titre 4",
    "Paste is now in plain text mode. Contents will now be pasted as plain text until you toggle this option off.": "Le presse-papiers est maintenant en mode \"texte plein\". Les contenus seront collés sans retenir les formatages jusqu'Ã  ce que vous désactiviez cette option.",
    Underline: "Souligné",
    Cancel: "Annuler",
    Justify: "Justifié",
    Inline: "En ligne",
    Copy: "Copier",
    "Align left": "Aligner Ã  gauche",
    "Visual aids": "Aides visuelle",
    "Lower Greek": "Grec minuscule",
    Square: "Carré",
    Default: "Par défaut",
    "Lower Alpha": "Alpha minuscule",
    Circle: "Cercle",
    Disc: "Disque",
    "Upper Alpha": "Alpha majuscule",
    "Upper Roman": "Romain majuscule",
    "Lower Roman": "Romain minuscule",
    Name: "Nom",
    Anchor: "Ancre",
    "You have unsaved changes are you sure you want to navigate away?": "Vous avez des modifications non enregistrées, Ãªtes-vous sÃ»r de quitter la page?",
    "Restore last draft": "Restaurer le dernier brouillon",
    "Special character": "CaractÃ¨res spéciaux",
    "Source code": "Code source",
    "Right to left": "Droite Ã  gauche",
    "Left to right": "Gauche Ã  droite",
    Emoticons: "EmoticÃ´nes",
    Robots: "Robots",
    "Document properties": "Propriété du document",
    Title: "Titre",
    Keywords: "Mots-clés",
    Encoding: "Encodage",
    Description: "Description",
    Author: "Auteur",
    Fullscreen: "Plein écran",
    "Horizontal line": "Ligne horizontale",
    "Horizontal space": "Espacement horizontal",
    "Insert/edit image": "Insérer/éditer une image",
    General: "Général",
    Advanced: "Avancé",
    Source: "Source",
    Border: "Bordure",
    "Constrain proportions": "Contraindre les proportions",
    "Vertical space": "Espacement vertical",
    "Image description": "Description de l'image",
    Style: "Style",
    Dimensions: "Dimensions",
    "Insert image": "Insérer une image",
    "Insert date/time": "Insérer date/heure",
    "Remove link": "Enlever le lien",
    Url: "Url",
    "Text to display": "Texte Ã  afficher",
    Anchors: "Ancres",
    "Insert link": "Insérer un lien",
    "New window": "Nouvelle fenÃªtre",
    None: "n/a",
    "The URL you entered seems to be an external link. Do you want to add the required http:// prefix?": "L'URL que vous avez entrée semble Ãªtre un lien externe. Voulez-vous ajouter le préfixe http:// nécessaire?",
    Target: "Cible",
    "The URL you entered seems to be an email address. Do you want to add the required mailto: prefix?": "L'URL que vous avez entrée semble Ãªtre une adresse e-mail. Voulez-vous ajouter le préfixe mailto: nécessaire?",
    "Insert/edit link": "Insérer/éditer un lien",
    "Insert/edit video": "Insérer/éditer une vidéo",
    Poster: "Publier",
    "Alternative source": "Source alternative",
    "Paste your embed code below:": "Collez votre code d'intégration ci-dessous :",
    "Insert video": "Insérer une vidéo",
    Embed: "Insérer",
    "Nonbreaking space": "Espace insécable",
    "Page break": "Saut de page",
    "Paste as text": "Coller comme texte",
    Preview: "Prévisualiser",
    Print: "Imprimer",
    Save: "Enregistrer",
    "Could not find the specified string.": "Impossible de trouver la chaÃ®ne spécifiée.",
    Replace: "Remplacer",
    Next: "Suiv",
    "Whole words": "Mots entiers",
    "Find and replace": "Trouver et remplacer",
    "Replace with": "Remplacer par",
    Find: "Chercher",
    "Replace all": "Tout remplacer",
    "Match case": "Respecter la casse",
    Prev: "Préc ",
    Spellcheck: "Vérification orthographique",
    Finish: "Finie",
    "Ignore all": "Tout ignorer",
    Ignore: "Ignorer",
    "Insert row before": "Insérer une ligne avant",
    Rows: "Lignes",
    Height: "Hauteur",
    "Paste row after": "Coller la ligne aprÃ¨s",
    Alignment: "Alignement",
    "Column group": "Groupe de colonnes",
    Row: "Ligne",
    "Insert column before": "Insérer une colonne avant",
    "Split cell": "Diviser la cellule",
    "Cell padding": "Espacement interne cellule",
    "Cell spacing": "Espacement inter-cellulles",
    "Row type": "Type de ligne",
    "Insert table": "Insérer un tableau",
    Body: "Corps",
    Caption: "Titre",
    Footer: "Pied",
    "Delete row": "Effacer la ligne",
    "Paste row before": "Coller la ligne avant",
    Scope: "Etendue",
    "Delete table": "Supprimer le tableau",
    "Header cell": "Cellule d'en-tÃªte",
    Column: "Colonne",
    Cell: "Cellule",
    Header: "En-tÃªte",
    "Cell type": "Type de cellule",
    "Copy row": "Copier la ligne",
    "Row properties": "Propriétés de la ligne",
    "Table properties": "Propriétés du tableau",
    "Row group": "Groupe de lignes",
    Right: "Droite",
    "Insert column after": "Insérer une colonne aprÃ¨s",
    Cols: "Colonnes",
    "Insert row after": "Insérer une ligne aprÃ¨s",
    Width: "Largeur",
    "Cell properties": "Propriétés de la cellule",
    Left: "Gauche",
    "Cut row": "Couper la ligne",
    "Delete column": "Effacer la colonne",
    Center: "Centré",
    "Merge cells": "Fusionner les cellules",
    "Insert template": "Ajouter un thÃ¨me",
    Templates: "ThÃ¨mes",
    "Background color": "Couleur d'arriÃ¨re-plan",
    "Text color": "Couleur du texte",
    "Show blocks": "Afficher les blocs",
    "Show invisible characters": "Afficher les caractÃ¨res invisibles",
    "Words: {0}": "Mots : {0}",
    Insert: "Insérer",
    File: "Fichier",
    Edit: "Editer",
    "Rich Text Area. Press ALT-F9 for menu. Press ALT-F10 for toolbar. Press ALT-0 for help": "Zone Texte Riche. Appuyer sur ALT-F9 pour le menu. Appuyer sur ALT-F10 pour la barre d'outils. Appuyer sur ALT-0 pour de l'aide.",
    Tools: "Outils",
    View: "Voir",
    Table: "Tableau",
    Format: "Format"
  });
};

OnMatch.AppointmentPatient = (function(superClass) {
  extend(AppointmentPatient, superClass);

  AppointmentPatient.prototype.match = '.appointment-wrapper';

  AppointmentPatient.prototype.shrink_limit = 5;

  function AppointmentPatient($wrapper) {
    this.$wrapper = $wrapper;
    AppointmentPatient.__super__.constructor.apply(this, arguments);
    this.$wrapper.parent().find('.ap-next, .ap-prev').click(this.day_change.bind(this));
    this.$select = this.$wrapper.parent().find('.appointment-type-select').siblings('select');
    this.$select.on('change', this.type_change.bind(this));
    this.$nodata = this.$wrapper.find('.no-data');
    this.$notype = this.$wrapper.find('.no-type');
    this.loader = this.$wrapper.find('.loader');
    this.loading_timer = null;
    this.url = this.$wrapper.find('table').attr('data-url');
    this.date = null;
    this.type = null;
    this.xhr = null;
    this.sync();
  }

  AppointmentPatient.prototype.day_change = function(e) {
    var $btn, $table, date, ref, side;
    if (this.loading) {
      return;
    }
    $btn = $(e.target);
    side = $btn.hasClass('ap-next') ? 'next' : 'prev';
    $table = this.$wrapper.find('table');
    date = $table.attr("data-" + side);
    if (!date) {
      return;
    }
    $table.addClass('animated slideOut' + (side === 'next' ? 'Left' : 'Right'));
    this.loading = true;
    this.$wrapper.parent().find('.ap-next, .ap-prev').removeClass('disabled');
    this.$nodata.addClass('hidden');
    this.$notype.addClass('hidden');
    this.date = date;
    this.set_timer();
    if ((ref = this.xhr) != null) {
      ref.abort();
    }
    return this.xhr = $.get(this.get_url(), (function(_this) {
      return function(response) {
        _this.clear_timer();
        $table.remove();
        _this.$wrapper.append($(response).addClass('animated slideIn' + (side !== 'next' ? 'Left' : 'Right')));
        return _this.sync();
      };
    })(this));
  };

  AppointmentPatient.prototype.get_url = function() {
    var url;
    url = this.url;
    if (this.type) {
      url += "/appointment/" + this.type;
    }
    if (this.date) {
      url += "/day/" + this.date;
    }
    return url;
  };

  AppointmentPatient.prototype.sync = function() {
    var $table, date, j, len1, ref, side;
    $table = this.$wrapper.find('table');
    this.shrink_table();
    ref = ['prev', 'next'];
    for (j = 0, len1 = ref.length; j < len1; j++) {
      side = ref[j];
      date = $table.attr("data-" + side);
      if (!date) {
        this.$wrapper.parent().find(".ap-" + side).addClass('disabled');
      }
    }
    return this.loading = false;
  };

  AppointmentPatient.prototype.type_change = function() {
    var $table, ref;
    $table = this.$wrapper.find('table');
    $table.addClass('animated fadeOut');
    this.type = this.$select.val();
    if (this.type === '__None') {
      this.type = null;
    }
    this.$wrapper.parent().find('.ap-next, .ap-prev').removeClass('disabled');
    this.$nodata.addClass('hidden');
    this.$notype.addClass('hidden');
    this.set_timer();
    if ((ref = this.xhr) != null) {
      ref.abort();
    }
    return this.xhr = $.get(this.get_url(), (function(_this) {
      return function(response) {
        _this.clear_timer();
        $table.remove();
        _this.$wrapper.append($(response).addClass('animated fadeIn'));
        return _this.sync();
      };
    })(this));
  };

  AppointmentPatient.prototype.shrink_table = function() {
    var $table, $tfoot, $tfootr;
    $table = this.$wrapper.find('table');
    if (this.$select.length > 0 && !$table.attr('data-appointment-type-id')) {
      this.$notype.removeClass('hidden');
      return;
    }
    if (!$table.find('a.slot').length) {
      this.$nodata.removeClass('hidden');
      return;
    }
    $table.append($tfoot = $('<tfoot>').append($tfootr = $('<tr>')));
    $table.find('tbody td').each(function(i, e) {
      var $overflowing;
      $overflowing = $(e).find("a.slot:gt(" + OnMatch.AppointmentPatient.prototype.shrink_limit + ")");
      if ($overflowing.length) {
        $overflowing.addClass('hidden');
        return $tfootr.append('<td><a class="expander">Voir plus</a></td>');
      } else {
        return $tfootr.append('<td></td>');
      }
    });
    if (!$tfoot.text()) {
      $tfoot.remove();
    }
    return $table.find('a.expander').on('click', function() {
      $table.find('.hidden').removeClass('hidden');
      return $tfoot.remove();
    });
  };

  AppointmentPatient.prototype.set_timer = function() {
    return this.loading_timer = setTimeout((function(_this) {
      return function() {
        _this.loader.removeClass('hidden');
        return _this.loader.spin({
          radius: 4,
          lines: 8,
          width: 2,
          length: 4,
          left: '25%'
        });
      };
    })(this), 500);
  };

  AppointmentPatient.prototype.clear_timer = function() {
    this.loader.addClass('hidden');
    this.loader.spin(false);
    clearTimeout(this.loading_timer);
    return this.loading_timer = null;
  };

  return AppointmentPatient;

})(Base);

OnMatch.AppointmentRange = (function(superClass) {
  extend(AppointmentRange, superClass);

  AppointmentRange.prototype.match = '.fc-range';

  function AppointmentRange($range) {
    this.$range = $range;
    AppointmentRange.__super__.constructor.apply(this, arguments);
    this.names = function(n) {
      return {
        table: "wtf_appointment_ranges-" + n,
        dow: "wtf_appointment_ranges-" + n + "-day_of_week",
        start: "wtf_appointment_ranges-" + n + "-start",
        stop: "wtf_appointment_ranges-" + n + "-stop"
      };
    };
    this.fc = this.$range.fullCalendar.bind(this.$range);
    this.$ul = $('#wtf_appointment_ranges');
    this.fc({
      lang: 'fr',
      defaultView: 'agendaWeek',
      axisFormat: "H:mm",
      selectHelper: true,
      selectable: true,
      editable: true,
      select: this.select.bind(this),
      eventConstraint: {
        start: this.$range.attr('data-start'),
        end: this.$range.attr('data-end'),
        dow: [0, 1, 2, 3, 4, 5, 6]
      },
      eventOverlap: false,
      eventClick: this.eventClick.bind(this),
      eventDrop: this.eventDrop.bind(this),
      eventResize: this.eventResize.bind(this),
      eventDragStop: this.eventTrash.bind(this),
      dragRevertDuration: 50,
      minTime: this.$range.attr('data-start'),
      maxTime: this.$range.attr('data-end'),
      defaultDate: this.dow_to_date(0),
      columnFormat: 'dddd',
      allDaySlot: false,
      height: 'auto',
      header: {
        left: '',
        right: '',
        center: ''
      },
      events: this.events.bind(this)
    });
  }

  AppointmentRange.prototype.events = function(start, end, timezone, callback) {
    var evts;
    evts = [];
    this.$ul.find('table').each((function(_this) {
      return function(i, e) {
        var $row, dow;
        $row = $(e);
        dow = $row.find("[name=" + (_this.names(i).dow) + "]").val();
        start = $row.find("[name=" + (_this.names(i).start) + "]").val();
        end = $row.find("[name=" + (_this.names(i).stop) + "]").val();
        return evts.push({
          id: i,
          start: _this.dow_to_date_time(dow, start),
          end: _this.dow_to_date_time(dow, end)
        });
      };
    })(this));
    return callback(evts);
  };

  AppointmentRange.prototype.select = function(start, end) {
    if (this.date_to_dow(start) === this.date_to_dow(end)) {
      this.$ul.append(this.create_li(this.date_to_dow(start), start, end));
    }
    return this.refresh();
  };

  AppointmentRange.prototype.eventClick = function(event, e, view) {};

  AppointmentRange.prototype.eventDrop = function(event, delta, revertFunc, e, ui, view) {
    this.update_li(event.id, this.date_to_dow(event.start), event.start, event.end);
    return this.refresh();
  };

  AppointmentRange.prototype.eventResize = function(event, delta, revertFunc, e, ui, view) {
    if (this.date_to_dow(event.start) === this.date_to_dow(event.end)) {
      this.update_li(event.id, this.date_to_dow(event.start), event.start, event.end);
    } else {
      revertFunc();
    }
    return this.refresh();
  };

  AppointmentRange.prototype.eventTrash = function(event, e) {
    var offset;
    offset = this.$range.offset();
    if (e.pageX < offset.left || e.pageX > offset.left + this.$range.outerWidth(true) || e.pageY < offset.top || e.pageY > offset.top + this.$range.outerHeight(true)) {
      this.delete_li(event.id);
      return this.refresh();
    }
  };

  AppointmentRange.prototype.date_to_dow = function(d) {
    return d.date() - 1;
  };

  AppointmentRange.prototype.dow_to_date = function(d) {
    return moment([2001, 0, d + 1]);
  };

  AppointmentRange.prototype.dow_to_date_time = function(d, t) {
    t = moment(t, 'HH:mm');
    d = +d;
    return moment([2001, 0, d + 1, t.hour(), t.minute()]);
  };

  AppointmentRange.prototype.refresh = function() {
    this.fc('unselect');
    this.fc('refetchEvents');
    return this.fc('rerenderEvents');
  };

  AppointmentRange.prototype.create_li = function(dow, start, end) {
    var id;
    id = this.$ul.find("table").length;
    return $('<li>').append($('<label>', {
      text: "Plage " + id
    }), $('<table>', {
      id: this.names(id).table
    }).append($('<tbody>').append($('<tr>').append($('<td>').append($('<input>', {
      type: 'hidden',
      name: this.names(id).dow
    }).val(dow), $('<input>', {
      type: 'hidden',
      name: this.names(id).start
    }).val(start.format('HH:mm')), $('<input>', {
      type: 'hidden',
      name: this.names(id).stop
    }).val(end.format('HH:mm')))))));
  };

  AppointmentRange.prototype.update_li = function(id, dow, start, end) {
    var $row;
    $row = this.$ul.find("#" + (this.names(id).table));
    $row.find("[name=" + (this.names(id).dow) + "]").val(dow);
    $row.find("[name=" + (this.names(id).start) + "]").val(start.format('HH:mm'));
    return $row.find("[name=" + (this.names(id).stop) + "]").val(end.format('HH:mm'));
  };

  AppointmentRange.prototype.delete_li = function(id) {
    this.$ul.find("#" + (this.names(id).table)).closest('li').remove();
    return this.$ul.find('li').each((function(_this) {
      return function(i, e) {
        var $li;
        $li = $(e);
        $li.find('table').attr('id', _this.names(i).table);
        $li.find('[name$=day_of_week]').attr('name', _this.names(i).dow);
        $li.find('[name$=start]').attr('name', _this.names(i).start);
        return $li.find('[name$=stop]').attr('name', _this.names(i).stop);
      };
    })(this));
  };

  return AppointmentRange;

})(Base);

OnMatch.Appointment = (function(superClass) {
  extend(Appointment, superClass);

  Appointment.prototype.match = '.fullcalendar.appointment';

  function Appointment($appointment1) {
    this.$appointment = $appointment1;
    Appointment.__super__.constructor.apply(this, arguments);
    $(window).on('keydown', (function(_this) {
      return function(e) {
        if (e.ctrlKey && e.keyCode === 70) {
          _this.search();
          e.preventDefault();
          return false;
        }
      };
    })(this));
    this.events_to_hl = [];
    $.getJSON(this.$appointment.attr('data-durations-url')).done((function(_this) {
      return function(data) {
        _this.types = data;
        return _this.load();
      };
    })(this));
  }

  Appointment.prototype.load = function() {
    var fullscreen;
    fullscreen = $('body').hasClass('appointment_fullscreen');
    this.$box = $('.fullcalendar-legend .box');
    this.fc = this.$appointment.fullCalendar.bind(this.$appointment);
    this.fc({
      lang: 'fr',
      height: fullscreen ? 'auto' : void 0,
      defaultView: 'agendaWeek',
      slotLabelFormat: "H:mm",
      selectable: true,
      selectHelper: true,
      select: this.select.bind(this),
      editable: true,
      eventClick: this.eventClick.bind(this),
      eventDrop: this.eventDrop.bind(this),
      eventResize: this.eventResize.bind(this),
      eventAfterRender: (function(_this) {
        return function(event, $element) {
          var base, key, keys, label, text;
          if (event.rendering === 'background') {
            return;
          }
          text = '<dl>';
          if (event.x_appointment_type && _this.types[event.x_appointment_type]) {
            text += '<dt>TypeÂ :</dt>';
            text += '<dd>' + _this.types[event.x_appointment_type].name + '</dd>';
          }
          keys = {
            name: 'Nom',
            firstname: 'Prénom',
            birthdate: 'Date de naissance',
            phone: 'Numéro de téléphone',
            mail: 'Email',
            description: 'Description'
          };
          for (key in keys) {
            label = keys[key];
            if (event[key]) {
              text += "<dt>" + label + "Â :</dt>";
              text += "<dd>" + (event[key].replace('\n', '<br>')) + "</dd>";
            }
          }
          text += '</dl>';
          if ($element.hasClass('fce-highlighted')) {
            if (typeof (base = $element.get(0)).scrollIntoView === "function") {
              base.scrollIntoView({
                behaviour: 'smooth'
              });
            }
          }
          return $element.qtip({
            content: {
              text: text,
              title: event.title || ''
            },
            position: {
              my: 'center left',
              at: 'center right'
            },
            style: {
              classes: 'qtip-dark qtip-rounded qtip-shadow'
            }
          });
        };
      })(this),
      eventDestroy: function(event, $element) {
        var ref;
        if (event.rendering === 'background') {
          return;
        }
        return (ref = $element.qtip('api')) != null ? ref.destroy(true) : void 0;
      },
      slotDuration: this.$appointment.attr('data-slot'),
      slotLabelInterval: this.$appointment.attr('data-slot'),
      slotEventOverlap: false,
      minTime: '08:00:00',
      maxTime: '22:00:00',
      header: {
        left: "agendaDay,agendaWeek,month search",
        center: "title",
        right: "today prev,next"
      },
      events: this.events.bind(this)
    });
    this.$appointment.find('.fc-toolbar').clone().addClass('fc-bottom-toolbar').appendTo(this.$appointment).find('button,h2').remove().end().find('.fc-left').append($('<button>', {
      type: 'button',
      "class": 'fc-find fc-button fc-state-default fc-corner-left fc-corner-right',
      text: 'Chercher'
    }).on('click', this.search.bind(this)), $('<button>', {
      type: 'button',
      "class": 'fc-unavailability fc-button fc-state-default fc-corner-left fc-corner-right',
      text: 'Ajouter une indisponibilité'
    }).on('click', function() {
      return $(this).toggleClass('fc-state-default fc-state-active').closest('.fullcalendar').toggleClass('fc-unavailability-mode');
    }), $('<button>', {
      type: 'button',
      "class": 'fc-find fc-button fc-state-default fc-corner-left fc-corner-right',
      text: 'Imprimer'
    }).on('click', this.print.bind(this)), $('<button>', {
      type: 'button',
      "class": 'fc-delay fc-button fc-state-default fc-corner-left fc-corner-right',
      text: 'Signaler un retard'
    }).on('click', this.delay.bind(this)), $('<button>', {
      type: 'button',
      "class": 'fc-expand fc-button fc-state-default fc-corner-left fc-corner-right',
      text: 'Ã‰tendre'
    }).on('click', this.expandToggle.bind(this)), $('<button>', {
      type: 'button',
      "class": 'fc-refresh fc-button fc-state-default fc-corner-left fc-corner-right',
      text: 'Rafraichir'
    }).on('click', this.refresh.bind(this))).end().find('.fc-right').append(this.$dot = $('<a>', {
      "class": 'color-dot',
      href: this.$appointment.attr('data-config-url')
    })).end();
    $('head').append($('<style>').text(".fc-slats table {\n  background: " + (this.$appointment.attr('data-color')) + ";\n}\n.color-dot {\n  border-color: " + (this.$appointment.attr('data-color')) + ";\n}\n.color-dot.websocket-connected {\n  background-color: " + (this.$appointment.attr('data-color')) + ";\n}"));
    this.concurrent_request = 0;
    return this.connect_socket();
  };

  Appointment.prototype.connect_socket = function() {
    try {
      this.ws = new WebSocket(this.$appointment.attr('data-websocket-watcher-url'));
      this.ws.onopen = (function(_this) {
        return function(e) {
          return _this.$dot.removeClass('websocket-error,websocket-closed').addClass('websocket-connected');
        };
      })(this);
      this.ws.onmessage = (function(_this) {
        return function(e) {
          return _this.refresh();
        };
      })(this);
      this.ws.onerror = (function(_this) {
        return function(e) {
          return _this.$dot.removeClass('websocket-connected').addClass('websocket-error');
        };
      })(this);
      return this.ws.onclose = (function(_this) {
        return function(e) {
          _this.$dot.removeClass('websocket-connected').addClass('websocket-closed');
          if (!hydra.debug) {
            return setTimeout((function() {
              return _this.connect_socket();
            }), 5000);
          }
        };
      })(this);
    } catch (undefined) {}
  };

  Appointment.prototype.search = function() {
    return this.modal(this.$appointment.attr('data-search-url'));
  };

  Appointment.prototype.delay = function() {
    return this.modal(this.$appointment.attr('data-delay-url'));
  };

  Appointment.prototype.expandToggle = function() {
    if (this.expanded) {
      this.fc('option', {
        minTime: this.minTime,
        maxTime: this.maxTime
      });
    } else {
      this.fc('option', {
        minTime: '00:00:00',
        maxTime: '24:00:00'
      });
    }
    this.$appointment.find('.fc-scroller').scrollTop(0);
    return this.expanded = !this.expanded;
  };

  Appointment.prototype.print = function() {
    return this.modal(this.$appointment.attr('data-print-url'), {
      day: this.fc('getDate').utc().format()
    });
  };

  Appointment.prototype.events = function(start, end, timezone, callback) {
    this.loading();
    $.ajax({
      url: this.$appointment.attr('data-feed-url'),
      data: {
        start: start.utc().format(),
        end: end.utc().format()
      },
      dataType: 'json'
    }).done((function(_this) {
      return function(data) {
        var endTime, event, events, j, len1, ref, startTime;
        events = [];
        ref = data.events;
        for (j = 0, len1 = ref.length; j < len1; j++) {
          event = ref[j];
          event.className = ['fce', 'fce-default', "fce-" + event.status, "fce-r" + (event.editable && 'w' || 'o')];
          _this.minTime = '24:00:00';
          _this.maxTime = '00:00:00';
          event.start = event.dtstart;
          event.end = event.dtend;
          event.title = event.summary;
          if (event.rendering === 'background') {
            if (!(event.x_appointment_type in _this.types)) {
              continue;
            }
            event.backgroundColor = _this.types[event.x_appointment_type].color;
            startTime = moment(event.start).format('HH:mm:ss');
            endTime = moment(event.end).format('HH:mm:ss');
            if (startTime < _this.minTime) {
              _this.minTime = startTime;
            }
            if (endTime > _this.maxTime) {
              _this.maxTime = endTime;
            }
          } else {
            if (event.x_appointment_type in _this.types) {
              event.color = _this.types[event.x_appointment_type].color;
            } else {
              event.color = '#FF0000';
              event.borderColor = '#000000';
              console.error('Event', event, 'without type');
            }
            if (hydra.utils.contrast(event.color)) {
              event.textColor = 'rgba(0, 0, 0, .9)';
            } else {
              event.textColor = 'rgba(255, 255, 255, .9)';
            }
            if (event.status === 'unconfirmed') {
              event.backgroundColor = event.textColor;
              event.textColor = event.color;
            }
            if (_this.events_to_hl.indexOf(event.uid) > -1) {
              event.color = '#FFFF00';
              event.textColor = '#000000';
            }
            _this.count(event);
          }
          events.push(event);
        }
        _this.renderCount(event);
        _this.events_to_hl = [];
        if (_this.minTime === '24:00:00') {
          _this.minTime = '08:00:00';
        }
        if (_this.maxTime === '00:00:00') {
          _this.maxTime = '22:00:00';
        }
        _this.expanded = true;
        _this.expandToggle();
        return callback(events);
      };
    })(this)).always((function(_this) {
      return function() {
        return _this.done();
      };
    })(this));
    return this.$box.each(function() {
      var $box;
      $box = $(this);
      if (hydra.utils.contrast($box.css('backgroundColor'))) {
        return $box.css('color', 'rgba(0, 0, 0, .9)');
      } else {
        return $box.css('color', 'rgba(255, 255, 255, .9)');
      }
    });
  };

  Appointment.prototype.select = function(start, end) {
    var allDay, url;
    allDay = !start.hasTime();
    url = this.$appointment.attr('data-event-url');
    if (this.$appointment.find('.fc-unavailability').hasClass('fc-state-active')) {
      url = this.$appointment.attr('data-unavailability-url');
      this.$appointment.find('.fc-unavailability').removeClass('fc-state-active').addClass('fc-state-default').closest('.fullcalendar');
    }
    return this.modal(url, {
      allDay: allDay,
      start: start.utc().format(),
      end: end.utc().format()
    }, function() {
      this.$appointment.find('.fc-unavailability').removeClass('fc-unavailability-mode');
      return this.$appointment.removeClass('fc-unavailability-mode');
    });
  };

  Appointment.prototype.eventClick = function(event, e, view) {
    return this.edit(event);
  };

  Appointment.prototype.edit = function(event) {
    var url;
    if (!event.href) {
      return;
    }
    if (event.status === 'busy') {
      url = this.$appointment.attr('data-unavailability-url');
    } else {
      url = this.$appointment.attr('data-event-url');
    }
    return this.modal(url + '/' + btoa(event.href));
  };

  Appointment.prototype.eventDrop = function(event, delta, revertFunc, e, ui, view) {
    return this.update_event(event, revertFunc);
  };

  Appointment.prototype.eventResize = function(event, delta, revertFunc, e, ui, view) {
    return this.update_event(event, revertFunc);
  };

  Appointment.prototype.modal = function(url, data, callback) {
    var $mfp, cls;
    cls = this;
    return $mfp = $.magnificPopup.open({
      items: {
        src: url
      },
      type: 'ajax',
      ajax: {
        settings: {
          data: data
        }
      },
      closeOnBgClick: false,
      callbacks: {
        open: function() {
          return $('.mfp-ajax-holder').click(function(e) {
            if (e.target === e.currentTarget) {
              return $.magnificPopup.close();
            }
          });
        },
        ajaxContentAdded: function() {
          var $appointment, current_date;
          current_date = new Date();
          hydra.restart(OnMatch.WTForm);
          this.content.find('#wtf_x_person_login').chosen({
            allow_single_deselect: true
          }).change((function(_this) {
            return function(e, o) {
              var dynamic_field_query, selected;
              selected = (o != null ? o.selected : void 0) || _this.content.find('#wtf_x_person_login').val();
              dynamic_field_query = '#wtf_name, #wtf_firstname, #wtf_birthdate, #wtf_phone, #wtf_mail';
              if (selected === '__None') {
                return _this.content.find(dynamic_field_query).prop('readonly', false).val('');
              } else {
                _this.content.find('#wtf_name,#wtf_firstname').prop('readonly', true);
                _this.content.find('.chosen-container').spin({
                  left: '103%',
                  scale: .4
                });
                cls.loading();
                return $.ajax({
                  type: "POST",
                  data: {
                    person_login: selected
                  },
                  url: '/appointment/patient/info',
                  dataType: "json"
                }).done(function(person) {
                  _this.content.find('.chosen-container').spin(false);
                  _this.content.find('#wtf_name').val(person.name);
                  _this.content.find('#wtf_firstname').val(person.firstname);
                  _this.content.find('#wtf_birthdate').val(person.birthdate);
                  _this.content.find('#wtf_phone').val(person.phone);
                  return _this.content.find('#wtf_mail').val(person.mail);
                }).always(function() {
                  return cls.done();
                });
              }
            };
          })(this));
          this.content.find('#wtf_x_person_login').trigger('change');
          $('.mfp-wrap').on('mousedown', function(e) {
            if ($(e.target).is('input.hasDatepicker')) {
              return;
            }
            $('.mfp-wrap .hydra-datetime').datetimepicker('hide');
            $('.mfp-wrap .hydra-time').timepicker('hide');
            return $('.mfp-wrap .hydra-date').datepicker('hide');
          });
          this.content.find('form').filter(function() {
            return $(this).attr('action') !== cls.$appointment.attr('data-print-url');
          }).on('submit', cls.xhr_form_submit.bind(cls)).find('input,select,textarea').first().focus().select();
          $appointment = $('#wtf_x_appointment_type');
          if ($appointment.find('option').length === 1) {
            $appointment.closest('.pure-u-1').remove();
          }
          return $appointment.on('change', function() {
            var $end, $start, duration;
            $start = $('#wtf_start');
            $end = $('#wtf_end');
            duration = cls.types[$appointment.val()].minutes;
            if (!duration) {
              return;
            }
            return $end.val(moment($start.val(), 'DD/MM/YYYY HH:mm').add(duration, 'minutes').format('DD/MM/YYYY HH:mm'));
          });
        },
        close: (function(_this) {
          return function() {
            $('.mfp-wrap .hydra-datetime').datetimepicker('hide');
            $('.mfp-wrap .hydra-time').timepicker('hide');
            $('.mfp-wrap .hydra-date').datepicker('hide');
            if (callback != null) {
              callback.apply(_this);
            }
            return _this.fc('unselect');
          };
        })(this)
      }
    });
  };

  Appointment.prototype.xhr_form_submit = function(e, again) {
    var $form, xhr_form_done, xhr_form_fail;
    this.concurrent_request++;
    this.loading();
    $form = $(e.target);
    $form.find("label").each(function() {
      if ($(this).attr("data-original-label")) {
        return $(this).html($(this).attr("data-original-label"));
      }
    });
    xhr_form_fail = (function(_this) {
      return function(xhr) {
        var $submit, data;
        _this.concurrent_request--;
        data = $.parseJSON(xhr.responseText);
        $submit = $form.find('input[type=submit]');
        $submit.prop('disabled', false).val($submit.attr('data-value'));
        $submit.removeAttr('data-value');
        if (data.errors) {
          if (typeof console !== "undefined" && console !== null) {
            if (typeof console.log === "function") {
              console.log(data.errors);
            }
          }
          $.each(data.errors, function(key, errors) {
            var $label;
            $label = $form.find("label[for=\"" + key + "\"]");
            if (!$label.attr("data-original-label")) {
              $label.attr("data-original-label", $label.html());
            }
            $label.html(errors.join(", "));
            $label.effect("shake");
          });
        }
        if (data.exception) {
          if (typeof console !== "undefined" && console !== null) {
            if (typeof console.error === "function") {
              console.error(data.exception);
            }
          }
          if (again == null) {
            _this.xhr_form_submit(e, true);
          }
        }
      };
    })(this);
    xhr_form_done = (function(_this) {
      return function(data) {
        var $results, $submit, $table, j, len1, ref, ref1, result;
        _this.concurrent_request--;
        if (data.results) {
          $form.parent().find('.search-results').remove();
          $results = $('<div>', {
            "class": 'search-results'
          });
          $table = $('<table>');
          if (data.results.length) {
            ref = data.results;
            for (j = 0, len1 = ref.length; j < len1; j++) {
              result = ref[j];
              $table.append($('<tr>').append($('<td>', {
                "class": 'result-name'
              }).text(result.summary)).append($('<td>', {
                "class": 'result-time'
              }).text(_this.range_format(result))).on('click', (function(result) {
                return function(e) {
                  $.magnificPopup.close();
                  _this.fc('gotoDate', moment(result.dtstart));
                  return _this.events_to_hl.push(result.uid);
                };
              })(result)));
            }
          } else {
            $results.text('Aucun résultat.');
          }
          $form.after($results.append($table));
          $submit = $form.find('input[type=submit]');
          return $submit.prop('disabled', false).val($submit.attr('data-title'));
        } else {
          if (!(((ref1 = _this.ws) != null ? ref1.readyState : void 0) === 1 || _this.concurrent_request > 0)) {
            _this.refresh();
          }
          if (data.delay && data.delay.length) {
            return $.magnificPopup.instance.content.replaceWith("<div class=\"white-popup mfp-with-anim\"><p>" + data.delay + "\n</p></div>");
          } else {
            return $.magnificPopup.close();
          }
        }
      };
    })(this);
    $.ajax({
      type: "POST",
      data: $form.serialize(),
      url: $form.attr("action"),
      dataType: "json"
    }).fail(xhr_form_fail).done(xhr_form_done).always((function(_this) {
      return function() {
        return _this.done();
      };
    })(this));
    return false;
  };

  Appointment.prototype.range_format = function(event) {
    var end, start;
    start = moment(event.dtstart);
    end = moment(event.dtend);
    if (start.isSame(end, 'day')) {
      return (start.format('DD/MM/YYYY')) + " " + (start.format('HH:mm')) + " - " + (end.format('HH:mm'));
    }
    return (start.format('DD/MM/YYYY HH:mm')) + " - " + (end.format('DD/MM/YYYY HH:mm'));
  };

  Appointment.prototype.update_event = function(event, revert) {
    var url;
    if (!event.href) {
      return;
    }
    if (event.status === 'busy') {
      url = this.$appointment.attr('data-unavailability-url');
    } else {
      url = this.$appointment.attr('data-event-url');
    }
    event.className = ['fce', 'fce-loading', "fce-" + event.status, "fce-r" + (event.editable && 'w' || 'o')];
    this.loading();
    $.ajax({
      type: "POST",
      data: this.to_data(event),
      url: url + '/' + btoa(event.href),
      dataType: "json"
    }).done((function(_this) {
      return function() {
        var ref;
        _this.concurrent_request--;
        if (!(((ref = _this.ws) != null ? ref.readyState : void 0) === 1 || _this.concurrent_request > 0)) {
          return _this.refresh();
        }
      };
    })(this)).fail((function(_this) {
      return function(xhr) {
        var data, error, field, ref;
        _this.concurrent_request--;
        data = $.parseJSON(xhr.responseText);
        if (data.errors) {
          alert(((function() {
            var ref, results1;
            ref = data.errors;
            results1 = [];
            for (field in ref) {
              error = ref[field];
              results1.push(error.join(' - '));
            }
            return results1;
          })()).join('\n'));
        }
        if (typeof console !== "undefined" && console !== null) {
          if (typeof console.log === "function") {
            console.log(xhr.responseText);
          }
        }
        event.className = ['fce', 'fce-default', "fce-" + event.status, "fce-r" + (event.editable && 'w' || 'o')];
        revert();
        if (!(((ref = _this.ws) != null ? ref.readyState : void 0) === 1 || _this.concurrent_request > 0)) {
          return _this.refresh();
        }
      };
    })(this)).always((function(_this) {
      return function() {
        return _this.done();
      };
    })(this));
    return this.concurrent_request++;
  };

  Appointment.prototype.to_data = function(event) {
    var key, o, value;
    o = {};
    if (event.start.hasTime()) {
      event.allDay = false;
      if (event.end === null) {
        event.end = event.start.clone().add(2, 'hours');
      }
    } else {
      event.start.time('');
      if (event.end === null) {
        event.end = event.start.clone().add(1, 'days');
      } else {
        event.end.time('');
      }
      event.allDay = true;
    }
    for (key in event) {
      value = event[key];
      if (value != null ? value._isAMomentObject : void 0) {
        value = value.format('DD/MM/YYYY HH:mm');
      }
      if (typeof value !== 'object' || value === null) {
        o['wtf_' + key] = value;
      }
    }
    return o;
  };

  Appointment.prototype.loading = function() {
    var ref;
    return (ref = this.$dot) != null ? ref.spin({
      position: 'relative',
      scale: 2,
      length: .5,
      width: 2,
      radius: 8,
      lines: 20,
      color: this.$dot.css('borderColor')
    }) : void 0;
  };

  Appointment.prototype.done = function() {
    var ref;
    return (ref = this.$dot) != null ? ref.spin(false) : void 0;
  };

  Appointment.prototype.refresh = function() {
    this.fc('refetchEvents');
    return this.fc('rerenderEvents');
  };

  Appointment.prototype.count = function(evt) {
    var count, dow;
    count = $("[data-type-id=" + evt.x_appointment_type + "]").data('count') || {};
    dow = moment(evt.start).format('Edddd');
    if (!(dow in count)) {
      count[dow] = 0;
    }
    count[dow] += 1;
    return $("[data-type-id=" + evt.x_appointment_type + "]").data('count', count);
  };

  Appointment.prototype.renderCount = function() {
    return $('[data-type-id]').each(function() {
      var $type, c, count, dow, t, txt;
      $type = $(this);
      $type.find('.type-count').empty();
      count = $type.data('count');
      if (!count) {
        return;
      }
      txt = [];
      for (dow in count) {
        c = count[dow];
        txt.push(dow + ": " + c);
      }
      $type.find('.type-count').text(((function() {
        var j, len1, ref, results1;
        ref = txt.sort();
        results1 = [];
        for (j = 0, len1 = ref.length; j < len1; j++) {
          t = ref[j];
          results1.push(t.slice(1));
        }
        return results1;
      })()).join(', '));
      return $type.data('count', {});
    });
  };

  return Appointment;

})(Base);

OnMatch.Category = (function(superClass) {
  extend(Category, superClass);

  Category.prototype.match = '#wtf_product_otc, #wtf_product_medicine';

  function Category(match) {
    this.init_drag(match);
  }

  Category.prototype.init_drag = function(match) {
    var blockSort, drag_select, selector;
    selector = "#" + match.attr('id');
    drag_select = $(selector + " .chosen-select");
    blockSort = true;
    drag_select.chosen();
    $(selector + " .sortable2 p").each(function() {
      var category, name;
      category = $(this).data("category");
      name = $(this).text();
      $(selector + " .sortable1 [data-category=" + category + "]").addClass("disabled-select");
    });
    drag_select.trigger("chosen:updated");
    $(".sub").hide();
    $(selector + " .category-accordion").on("click", function() {
      if ($(this).parent().siblings(".sub").is(":visible")) {
        $(this).parent().siblings(".sub").hide();
        $(this).siblings(".category-label").removeClass("active");
        $(this).removeClass("active fa-rotate-90");
      } else {
        $(this).parent().siblings(".sub").show();
        $(this).siblings(".category-label").addClass("active");
        $(this).addClass("active fa-rotate-90");
      }
    });
    $(document).on('click', '.delete-category', function(e) {
      var category;
      category = $(e.target).parent().data('category');
      drag_select.children("option[value=" + category + "]").remove();
      drag_select.trigger("chosen:updated");
      $(selector + " .sortable1").find("[data-category=\"" + category + "\"]").removeClass("disabled-select");
      $(e.target).parents('li').remove();
    });
    $(selector + " .sortable1").sortable({
      connectWith: ".connectedSortable",
      items: "p",
      revert: true,
      helper: "clone",
      placeholder: "drag-placeholder",
      remove: function(event, ui) {
        $(this).sortable("cancel");
      },
      update: function(event, ui) {
        $(selector + " .sortable1").sortable("cancel");
      },
      start: function(event, ui) {
        $(selector + " .sortable1").find("p:hidden").show();
      },
      stop: function(event, ui) {
        var category, clone, delete_option, item, name, root;
        if (!blockSort) {
          item = ui.item;
          name = item.text();
          category = item.attr("data-category");
          clone = item.clone(true);
          if (!item.hasClass("disabled-select")) {
            clone.find(".category-accordion").remove();
            if (!item.hasClass("root-category")) {
              root = item.parents(".sub:not(.sub .sub)").siblings(".root-category").clone();
              root.find(".category-accordion").remove();
              if (root.length > 0 && root !== item) {
                clone.append("<span> ( " + root.text() + ")</span>");
              }
            }
            ui.item.addClass("disabled-select");
            delete_option = $('<i>').addClass('fa fa-minus-square delete-category');
            clone.append(delete_option);
            $(selector + " .sortable2").append(clone.wrap("<li></li>").parent());
          }
          $(this).sortable("cancel");
        }
        blockSort = true;
      }
    }).disableSelection();
    $(selector + " .sortable2").sortable({
      placeholder: "drag-placeholder",
      helper: "clone",
      items: "> li",
      receive: function(event, ui) {
        var category, item;
        blockSort = false;
        item = ui.item;
        category = item.attr("data-category");
        if (!item.hasClass("disabled-select")) {
          drag_select.append("<option value='" + category + "' selected='selected'>" + name + "</option>");
          drag_select.trigger("chosen:updated");
        }
      }
    }).disableSelection();
  };

  return Category;

})(Base);

OnMatch.ClickToCall = (function(superClass) {
  extend(ClickToCall, superClass);

  ClickToCall.prototype.match = '#click-to-call';

  function ClickToCall($clicktocall) {
    this.$clicktocall = $clicktocall;
    ClickToCall.__super__.constructor.apply(this, arguments);
    this.$clicktocall.parent().magnificPopup({
      type: 'ajax'
    });
    $(document).on('click', '.confirm-click-to-call', function(e) {
      e.preventDefault();
      $('#click-to-call-content form').load($(e.target).attr('data-url'));
    });
    $(document).on('click', '.decline-click-to-call', function(e) {
      e.preventDefault();
      $.magnificPopup.close();
    });
  }

  return ClickToCall;

})(Base);

OnMatch.ClickToChat = (function(superClass) {
  extend(ClickToChat, superClass);

  ClickToChat.prototype.match = '#click-to-chat';

  function ClickToChat($clicktochat) {
    this.$clicktochat = $clicktochat;
    ClickToChat.__super__.constructor.apply(this, arguments);
    this.$clicktochat.parent().magnificPopup({
      type: 'ajax'
    });
    $(document).on('click', '.confirm-click-to-chat', function(e) {
      e.preventDefault();
      $('#click-to-chat-content form').load($(e.target).attr('data-url'));
    });
    $(document).on('click', '.decline-click-to-chat', function(e) {
      e.preventDefault();
      $.magnificPopup.close();
    });
  }

  return ClickToChat;

})(Base);

OnMatch.Collapsible = (function(superClass) {
  extend(Collapsible, superClass);

  Collapsible.prototype.match = '.collapsible';

  function Collapsible($collapsible) {
    this.$collapsible = $collapsible;
    Collapsible.__super__.constructor.apply(this, arguments);
    this.$root_h2 = this.$collapsible.find('> h2');
    this.$root_ul = this.$collapsible.find('> ul');
    this.$root_h2.on('click', this.toggle_open.bind(this));
    this.$collapsible.find('li').on('click', this.toggle_active.bind(this));
    $("body").on('responsive', this.respond.bind(this));
  }

  Collapsible.prototype.respond = function(e) {
    var ref, ref1;
    if (e.old) {
      this.$collapsible.find('.active').removeClass('active');
      this.$collapsible.find('ul').attr('style', '');
      if ((ref = e["new"]) !== 'xl' && ref !== 'xxl') {
        this.$collapsible.find('> ul').removeClass('open');
      }
    }
    if ((ref1 = e["new"]) === 'xl' || ref1 === 'xxl') {
      return this.$collapsible.find('> ul').addClass('open');
    }
  };

  Collapsible.prototype.toggle_open = function(e) {
    $('body').trigger('layout');
    if (this.$root_ul.hasClass('open')) {
      return this.$root_ul.slideUp((function(_this) {
        return function() {
          return _this.$root_ul.removeClass('open');
        };
      })(this));
    } else {
      this.$root_ul.slideDown();
      return this.$root_ul.addClass('open');
    }
  };

  Collapsible.prototype.toggle_active = function(e) {
    var $li, $parallel_active_links, $ul, count, link_status, ref;
    if ($(e.target).is('a') && $(e.target).attr('href')) {
      return true;
    }
    $('body').trigger('layout');
    $li = $(e.currentTarget);
    $ul = $li.closest('ul');
    if (((ref = responsive.size) === 'xl' || ref === 'xxl') && ($ul.hasClass('subsubnav') || $ul.hasClass('multi-dropdown'))) {
      return;
    }
    $parallel_active_links = $ul.find('.active');
    link_status = $li.hasClass('active');
    count = 0;
    $ul.find('ul').slideUp(function() {
      if (++count === $ul.find('ul').length) {
        return $parallel_active_links.removeClass('active');
      }
    });
    if (!link_status) {
      $li.children('ul').slideDown();
      $li.addClass('active');
    }
    return $(e.target).is('a');
  };

  return Collapsible;

})(Base);

OnMatch.AmazonMenu = (function(superClass) {
  extend(AmazonMenu, superClass);

  AmazonMenu.prototype.match = '.category .subnav';

  function AmazonMenu($subnav) {
    this.$subnav = $subnav;
    AmazonMenu.__super__.constructor.apply(this, arguments);
    this.$subnav.find('> li').on('mouseenter', this.mouseenter.bind(this));
    $(window).mousemove(this.mousemove.bind(this));
    this.$floating = $('#category_floating');
    if (!this.$floating.length) {
      this.$floating = $("<div>", {
        id: "category_floating",
        "class": "box category floating"
      });
      $("body").append(this.$floating.hide());
    }
    $("body").on('responsive', this.respond.bind(this));
  }

  AmazonMenu.prototype.respond = function(e) {
    return this.$floating.hide();
  };

  AmazonMenu.prototype.mouseenter = function(e) {
    var $a, $box, $li, $ul, ref;
    if ((ref = responsive.size) !== 'xl' && ref !== 'xxl') {
      return;
    }
    $li = $(e.currentTarget);
    $a = $li.find("> a");
    $ul = $a.next("ul");
    $box = $a.closest(".collapsible");
    if (!$ul.length) {
      return;
    }
    return this.$floating.empty().append($("<h2>").text($a.text())).append($ul.clone().show()).css({
      position: "absolute",
      top: hydra.utils.absolute_top($box),
      left: hydra.utils.absolute_left($li) + $li.width(),
      height: Math.max($box.height(), this.$floating.height())
    }).show();
  };

  AmazonMenu.prototype.mousemove = function(e) {
    var $target;
    if (!this.$floating.is(":visible")) {
      return;
    }
    $target = $(e.target);
    if ($target.closest("#category_floating").length) {
      return;
    }
    if ($target.closest(".category").length && !$target.closest('.alone').length) {
      return;
    }
    return this.$floating.hide();
  };

  return AmazonMenu;

})(Base);

OnMatch.DataTable = (function(superClass) {
  extend(DataTable, superClass);

  DataTable.prototype.match = '.manage-table table';

  function DataTable($datatable) {
    this.$datatable = $datatable;
    this.build_table = bind(this.build_table, this);
    DataTable.__super__.constructor.apply(this, arguments);
    this.requestIndex = 0;
    this.$search = $('.search-form');
    this.$search.hide();
    this.build_table();
    $('.search button').on('click', (function(_this) {
      return function() {
        return _this.$search.slideToggle();
      };
    })(this));
    $('.pagination .paginate-choice').on('click', (function(_this) {
      return function(event) {
        $('.chosen').removeClass('chosen');
        $(event.target).addClass('chosen');
        return _this.build_table();
      };
    })(this));
    $('.navigation').on('click', '.clickable', (function(_this) {
      return function(event) {
        var length, start, total, way;
        start = parseInt($('.navigation').attr('data-start'));
        total = parseInt($('.count').find('.total').text());
        length = parseInt($('.pagination .chosen').text());
        way = $(event.target).parent().hasClass('next') ? 'plus' : 'minus';
        if (way === 'minus') {
          start = start - length > 0 ? start - length : 0;
        } else {
          start = start + length < total ? start + length : total;
        }
        $('.navigation').attr('data-start', start);
        return _this.build_table();
      };
    })(this));
    this.$search.find('input').on('input', (function(_this) {
      return function() {
        return _this.build_table();
      };
    })(this));
    this.$search.find('select').on('change', (function(_this) {
      return function() {
        return _this.build_table();
      };
    })(this));
    this.$datatable.find('thead th.orderable').on('click', (function(_this) {
      return function(event) {
        var $th, col_sort, j, len1, ref, sort, th;
        ref = _this.$datatable.find('thead th');
        for (j = 0, len1 = ref.length; j < len1; j++) {
          th = ref[j];
          $(th).removeClass('sort_asc sort_desc');
        }
        $th = $(event.target);
        $th.closest('thead').attr('data-col', $th.attr('data-name'));
        if ($th.hasClass('orderable')) {
          sort = $th.closest('thead').attr('data-sort');
          col_sort = sort === 'asc' ? 'desc' : 'asc';
          $th.closest('thead').attr('data-sort', col_sort);
          $th.addClass('sort_' + col_sort);
          return _this.build_table();
        }
      };
    })(this));
    this.$datatable.on('click', 'input[type="checkbox"]', (function(_this) {
      return function() {
        var ids;
        ids = _this.$datatable.find(':checked').map(function() {
          return $(this).attr('data-id');
        }).get();
        return $('[name="ids"]').val(ids);
      };
    })(this));
    $('.checkbox-action-select').on('change', (function(_this) {
      return function(e) {
        var $checked, option_val;
        option_val = $(e.target).val();
        $checked = _this.$datatable.find('td input:checked');
        if (option_val !== 'default' && $checked.size()) {
          $('.checkbox-form').attr('action', option_val);
          return $('.checkbox-form').trigger('submit');
        }
      };
    })(this));
  }

  DataTable.prototype.build_table = function() {
    var $data, $loading, xhr;
    if (this.$datatable.find('.loading').length === 0) {
      $loading = $('<span class="loading">Mise Ã  jour</span>');
      this.$datatable.append($loading);
    }
    $data = {
      sortCol: this.$datatable.find('thead').attr('data-col'),
      sortDir: this.$datatable.find('thead').attr('data-sort'),
      length: $('.chosen').text(),
      start: $('.navigation').attr('data-start'),
      search: JSON.stringify(this.$search.serializeObject())
    };
    if (typeof xhr !== "undefined" && xhr !== null) {
      xhr.abort();
    }
    return xhr = $.ajax({
      url: window.location.pathname,
      type: 'POST',
      dataType: "text",
      rqIndex: ++this.requestIndex,
      data: $data,
      traditional: true,
      success: (function(_this) {
        return function(response) {
          var $count, $next, $prev, $tbody, $td, $tr, class_name, col_value, j, k, l, len, len1, len2, len3, ref, ref1, row;
          if ( this .rqIndex === _this.requestIndex) {
            response = JSON.parse(response);
            $tbody = _this.$datatable.find('tbody');
            $tbody.empty();
            $count = $('p.count');
            $count.removeClass('hidden');
            $tbody.html(response.table);
            ref = ['display_start', 'stop', 'total'];
            for (j = 0, len1 = ref.length; j < len1; j++) {
              class_name = ref[j];
              $count.find("." + class_name).text(response[class_name]);
            }
            if (response.rows.length > 0) {
              ref1 = response.rows;
              for (k = 0, len2 = ref1.length; k < len2; k++) {
                row = ref1[k];
                $tr = $('<tr>');
                for (l = 0, len3 = row.length; l < len3; l++) {
                  col_value = row[l];
                  $td = $('<td>');
                  if (((col_value != null ? col_value.match('href') : void 0) != null) && ($(col_value).attr('data-search') != null)) {
                    $td.addClass('hydra-icon-search');
                  }
                  if ((response.stock_index != null) && row.indexOf(col_value) === response.stock_index) {
                    $td.addClass($(col_value).attr('class'));
                    col_value = $(col_value).contents().unwrap();
                  }
                  $td.append(col_value);
                  $tr.append($td);
                }
                $tbody.append($tr);
              }
            } else {
              len = _this.$datatable.find('thead th').length;
              $tbody.append("<tr><td class=\"center\" colspan=\"" + len + "\">\nAucun élément Ã  afficher.</td></tr>");
            }
            $prev = $('.navigation .prev');
            $next = $('.navigation .next');
            if (response.start - parseInt($('.chosen').text()) >= 0) {
              if (!$prev.hasClass('clickable')) {
                $prev.addClass('clickable pointer');
              }
            } else {
              $prev.removeClass('clickable pointer');
            }
            if (response.stop < response.total) {
              if (!$next.hasClass('clickable')) {
                $next.addClass('clickable pointer');
              }
            } else {
              $next.removeClass('clickable pointer');
            }
            if (_this.$datatable.find('.loading').length > 0) {
              _this.$datatable.find('.loading').remove();
            }
            _this.$datatable.find('a.delete,a.cancel').magnificPopup({
              type: 'ajax'
            });
            _this.$datatable.find("td a[href^='/unsubscribe/']").magnificPopup({
              type: 'ajax'
            });
            if (_this.$datatable.find('th[class^=sort_]').length === 0) {
              _this.$datatable.find('thead').attr('data-col', response.sortCol);
              _this.$datatable.find('thead').attr('data-sort', response.sortDir);
              return _this.$datatable.find("th[data-name=" + response.sortCol + "]").addClass('sort_' + response.sortDir);
            }
          }
        };
      })(this)
    });
  };

  return DataTable;

})(Base);

OnMatch.Faq = (function(superClass) {
  extend(Faq, superClass);

  Faq.prototype.match = '.faq-contents';

  function Faq($match) {
    Faq.__super__.constructor.apply(this, arguments);
    $match.sticky({
      topSpacing: 30,
      wrapperClassName: "pure-u-lg-1-5"
    }, $('.section h4').each(function(index) {
      return $(this).nextUntil('h4').wrapAll("<div class='faq-content' />");
    }));
    $('.section').waypoint({
      offset: 20,
      handler: function(direction) {
        var id;
        id = $(this).prop('id');
        $('.internal').parent('li').removeClass('active');
        return $match.find(".internal[href='#" + id + "']").parent('li').addClass('active');
      }
    });
    $('.section h4').on('click', function(e) {
      $(this).toggleClass('content-visible');
      return $(this).next('.faq-content').slideToggle(200);
    });
    $('.faq-contents a').click(function(e) {
      e.preventDefault();
      return $('html, body').animate({
        scrollTop: $($(this).attr('href')).offset().top
      });
    });
  }

  return Faq;

})(Base);

OnMatch.ZipFilter = (function(superClass) {
  extend(ZipFilter, superClass);

  ZipFilter.prototype.match = '#zipfilter';

  function ZipFilter($filter) {
    this.$filter = $filter;
    this.filter_change = bind(this.filter_change, this);
    ZipFilter.__super__.constructor.apply(this, arguments);
    this.$filter.on("change input", this.filter_change.bind(this));
    this.$rows = $(".client-row");
  }

  ZipFilter.prototype.filter_change = function() {
    var $rows, zip;
    zip = $.trim(this.$filter.val());
    if (zip) {
      $rows = $("[class^=\"zip" + zip + "\"]");
      this.$rows.hide();
      return $rows.show();
    } else {
      return this.$rows.show();
    }
  };

  return ZipFilter;

})(Base);

OnMatch.LinkActive = (function(superClass) {
  extend(LinkActive, superClass);

  LinkActive.prototype.match = '.multi-dropdown';

  function LinkActive($active) {
    this.$active = $active;
    LinkActive.__super__.constructor.apply(this, arguments);
    this.add_class_active();
  }

  LinkActive.prototype.add_class_active = function() {
    if (this.$active.find('li a').first().is('.current_page') === true) {
      return this.$active.find('li a').first().parent('li').addClass('current_page');
    } else {
      return this.$active.find('ul.subnav a.current_page').parents('li').addClass('current_page');
    }
  };

  return LinkActive;

})(Base);

OnMatch.Chat = (function(superClass) {
  extend(Chat, superClass);

  Chat.prototype.match = '.chats tr';

  function Chat($chat) {
    this.$chat = $chat;
    Chat.__super__.constructor.apply(this, arguments);
    this.$chat.on('mouseup', ((function(_this) {
      return function() {
        var $read;
        $read = _this.$chat.find('a.read');
        if ($read.length) {
          return window.location = $read.attr('href');
        }
      };
    })(this)));
  }

  return Chat;

})(Base);

OnMatch.Unsubscribe = (function(superClass) {
  extend(Unsubscribe, superClass);

  Unsubscribe.prototype.match = "li a[href^='/unsubscribe/']";

  function Unsubscribe($link1) {
    this.$link = $link1;
    Unsubscribe.__super__.constructor.apply(this, arguments);
    this.$link.magnificPopup({
      type: 'ajax'
    });
  }

  return Unsubscribe;

})(Base);

OnMatch.Iconize = (function(superClass) {
  extend(Iconize, superClass);

  Iconize.prototype.match = 'main';

  function Iconize($main) {
    this.$main = $main;
    Iconize.__super__.constructor.apply(this, arguments);
    $('.iconize').on('click', this.iconize_click.bind(this));
    $(window).on('resize', this.reset.bind(this));
    $('body').on('responsive', this.respond.bind(this));
    $('body').on('layout', this.close_iconize.bind(this));
    this.size = void 0;
  }

  Iconize.prototype.reset = function() {
    var ref, ref1;
    $('.product_line.toolbox').toggle((ref = this.size) === 'xl' || ref === 'xxl');
    if ((ref1 = this.size) === 'xl' || ref1 === 'xxl') {
      $('.shortcut').parent().removeClass('hidden');
    } else {
      if (!$('.shortcut').parent().hasClass('hidden')) {
        $('.shortcut').parent().addClass('hidden');
      }
    }
    return $('.iconize').filter(function() {
      return !$(this).closest('#disabled_widgets').length;
    }).children().show().attr('style', '').children().filter(function() {
      return !($(this).hasClass('less') || $(this).hasClass('details'));
    }).show();
  };

  Iconize.prototype.respond = function(e) {
    var ref;
    this.size = e["new"];
    if ((ref = e["new"]) === 'xl' || ref === 'xxl') {
      return this.reset();
    }
  };

  Iconize.prototype.close_iconize = function() {
    var iconize, j, len1, ref, results1;
    ref = $('.iconize.open');
    results1 = [];
    for (j = 0, len1 = ref.length; j < len1; j++) {
      iconize = ref[j];
      $(iconize).removeClass('open');
      results1.push($(iconize).children().hide().children().hide());
    }
    return results1;
  };

  Iconize.prototype.iconize_click = function(e) {
    var $icon, open, ref;
    $icon = $(e.currentTarget);
    if ((ref = this.size) === 'xl' || ref === 'xxl') {
      return;
    }
    if ($icon.closest("#disabled_widgets").length) {
      return;
    }
    open = $icon.hasClass("open");
    if ($(e.target).hasClass('iconize')) {
      this.close_iconize();
      if (open) {
        return;
      }
      $icon.parent().find(".open").removeClass("open");
      $icon.addClass("open");
      $icon.children().show().children().filter(function() {
        return !($(this).hasClass('less') || $(this).hasClass('details'));
      }).show();
      return $('body').trigger('map-refresh');
    }
  };

  return Iconize;

})(Base);

OnMatch.Medsite = (function(superClass) {
  extend(Medsite, superClass);

  Medsite.prototype.match = '#medsite-layout';

  function Medsite($medsite) {
    this.$medsite = $medsite;
    this.$medsite.find('.sticky-menu li:not(.subscribe) a, .learn-more > a').on('click', function(e) {
      var $target, menu_height;
      e.preventDefault();
      $target = $("" + ($(e.target).attr('href')));
      menu_height = $('.sticky-menu').height();
      return $('html, body').animate({
        scrollTop: $target.offset().top - menu_height
      }, 700);
    });
    window.sr = new scrollReveal();
    this.$medsite.find('.sticky-menu').sticky();
    this.$medsite.find('.sticky-wrapper').attr('style', '');
    $('#parallax-intro').attr("style", "min-height: " + ($(window).height()) + "px;");
    $('#parallax-intro').parallax({
      imageSrc: $('#parallax-intro').attr('data-img')
    });
    $('#parallax-services').parallax({
      imageSrc: $('#parallax-services').attr('data-img')
    });
    $('.left div, .right div').on('mouseenter', function() {
      var div;
      if ($(this).attr('data-name') !== $('.middle img').attr('data-current')) {
        div = $(this);
        return $('.middle').fadeOut(function() {
          $('.middle img').attr('src', div.attr('data-src'));
          $('.middle img').attr('data-current', div.attr('data-name'));
          return $('.middle').fadeIn();
        });
      }
    });
    $(window).on('scroll', function() {
      var phone_top, window_top;
      phone_top = $('#history ul:first').offset().top;
      window_top = $(window).scrollTop() + $(window).height();
      if (phone_top <= window_top) {
        return $('#history ul:first li').each(function(indice, li) {
          var interval, max, number;
          number = parseInt($(li).find('.counter').text());
          max = parseInt($(li).find('.counter').attr('data-max'));
          return interval = setInterval((function() {
            $(li).find('.counter').text(number);
            if (number < max) {
              return number++;
            } else {
              return clearInterval(interval);
            }
          }), parseInt($(li).find('.counter').attr('data-interval')));
        });
      }
    });
    this.$medsite.find('#history .slick').slick({
      dots: false,
      arrows: false,
      autoplay: true,
      slidesToShow: 2,
      slidesToScroll: 2
    });
    $('.screen .computer').slick({
      dots: false,
      arrows: false,
      vertical: true,
      autoplay: true,
      verticalSwiping: true,
      asNavFor: ".mobile"
    });
    $('.screen .mobile').slick({
      dots: false,
      arrows: false,
      vertical: true,
      autoplay: true,
      verticalSwiping: true,
      asNavFor: ".computer"
    });
    this.$medsite.find('.contact-form').on('submit', function(e) {
      e.preventDefault();
      return $.post($(this).attr('action'), $(this).serialize()).done(function(response) {
        return alert('Message envoyé');
      });
    });
  }

  return Medsite;

})(Base);

OnMatch.Contact = (function(superClass) {
  extend(Contact, superClass);

  Contact.prototype.match = '.medsite-contact';

  function Contact($mail) {
    this.$mail = $mail;
    Contact.__super__.constructor.apply(this, arguments);
    this.$mail.on('click', function(e) {
      return e.preventDefault();
    });
    this.$mail.magnificPopup({
      items: {
        src: $('.widget-content .mfp-hide').html(),
        type: 'inline'
      },
      callbacks: {
        open: function() {
          $('.mfp-content').children().addClass('white-popup mfp-with-anim contact-popup');
          return $('.mfp-content a').on('click', function() {
            return $.magnificPopup.close();
          });
        }
      }
    });
  }

  return Contact;

})(Base);

OnMatch.FillInfo = (function(superClass) {
  extend(FillInfo, superClass);

  FillInfo.prototype.match = '.fill_info article form';

  function FillInfo($info1) {
    var $section, $section_div, inputs, lessbutton, nb_to_delete, plusbutton;
    this.$info = $info1;
    FillInfo.__super__.constructor.apply(this, arguments);
    inputs = this.$info.find('input[type="radio"]');
    inputs.on('click', function() {
      if ($(this).val() === 'sector_1') {
        return $('#wtf_honorary').val('23 â‚¬');
      }
    });
    this.more_counter = 0;
    $section = this.$info.find('section');
    plusbutton = $('<button>').append('<i class="fa fa-plus"></i>');
    lessbutton = $('<button>').append('<i class="fa fa-minus"></i>');
    $section_div = $section.find('.original-section-element');
    if ($section_div.length === 0) {
      $section_div = $section.find('div.pure-u-sm-1-3');
      $section_div.addClass('original-section-element');
    }
    nb_to_delete = $section_div.length;
    $section.append(plusbutton);
    if ($section.find('.fa-minus').parent().length > 0) {
      lessbutton = $section.find('.fa-minus').parent();
      $section.append(lessbutton);
    }
    plusbutton.on('click', (function(_this) {
      return function(e) {
        var current_elements;
        e.preventDefault();
        $section = _this.$info.find('section');
        $section_div = $section.find('.original-section-element');
        $section_div.each(function() {
          var input, label, new_el;
          new_el = $( this ).clone();
          new_el.removeClass('original-section-element');
          label = new_el.find('label');
          input = new_el.find('input');
          label.attr('for', label.attr('for') + _this.more_counter);
          input.attr('id', input.attr('id') + _this.more_counter);
          input.val('');
          return $section.append(new_el);
        });
        $section.append(plusbutton);
        current_elements = $section.find('div.pure-u-sm-1-3');
        if (current_elements.length > $section_div.length) {
          $section.append(lessbutton);
        }
        return _this.more_counter += 1;
      };
    })(this));
    lessbutton.on('click', (function(_this) {
      return function(e) {
        var to_delete, to_delete_total;
        e.preventDefault();
        $section = _this.$info.find('section');
        $section_div = $section.find('div.pure-u-sm-1-3');
        to_delete = $section_div.filter(":not('.original-section-element')").slice(-nb_to_delete);
        if (to_delete.length > 0) {
          to_delete.remove();
        }
        $section_div = $section.find('div.pure-u-sm-1-3');
        to_delete_total = $section_div.filter(":not('.original-section-element')");
        if (to_delete_total.length === 0) {
          return lessbutton.detach();
        }
      };
    })(this));
  }

  return FillInfo;

})(Base);

OnMatch.Consent = (function(superClass) {
  extend(Consent, superClass);

  Consent.prototype.match = '.consent_add,.consent_edit';

  function Consent($consent) {
    var ref;
    this.$consent = $consent;
    Consent.__super__.constructor.apply(this, arguments);
    this.counter = parseInt((ref = this.$consent.find('#wtf_counter')) != null ? ref.val() : void 0) || 0;
    this.$title = this.$consent.find("h2");
    this.$add_questions = this.$consent.find('.add-questions');
    this.$more_question = this.$consent.find('.more-question');
    this.$hide_questions = this.$consent.find('.hide-questions');
    this.$counter_field = this.$consent.find('article form #wtf_counter');
    this.$form_without_section = this.$consent.find('article form div.pure-g > div').slice(0, 4);
    this.$section = this.$consent.find('article form section');
    this.$section.find('article:first').addClass('original');
    this.$section.find("[id^='wtf_questions-answers']").parent('div').append('<i class="fa fa-plus add-question">');
    this.$section.find("[id^='wtf_questions-answers']").parent('div').each(function() {
      if ($( this ).children('input').size() > 1) {
        return $( this ).append('<i class="fa fa-minus remove-answer">');
      }
    });
    this.$section.find('[data-counter]').closest('article:not([data-counter])').each(function() {
      return $( this ).attr('data-counter', $( this ).find('[data-counter]:first').attr('data-counter'));
    });
    this.$section.find("article:not(.original)").each(function() {
      return $( this).append("<i class=\"fa fa-times remove-question\"\ndata-counter=\"" + ($( this ).attr('data-counter')) + "\">");
    });
    this.$section.find("[value='textarea'][type='radio']:checked").each(function() {
      var counter;
      counter = $( this ).parent('article').attr('data-counter');
      return $("#wtf_questions-answers_" + counter).parent('div').hide();
    });
    this.$section.hide();
    this.$section.on('click', 'input[type="radio"]', function(e) {
      var $article, $div, $linked_label, $linked_title, counter, name, ref1, ref2;
      if ($(e.target).val() === 'textarea') {
        $(e.target).closest('div').next('div').hide();
        return (ref1 = $(e.target).closest('article').find('[data-field="linked_title"]')) != null ? ref1.parent('div').hide() : void 0;
      } else {
        $(e.target).closest('div').next('div').show();
        if ($(e.target).val().indexOf('_textarea') !== -1) {
          $article = $(e.target).closest('article');
          if ($article.find('[data-field="linked_title"]').size()) {
            $article.find('[data-field="linked_title"]').parent('div').show();
            return;
          }
          counter = $article.attr('data-counter') || 0;
          name = "wtf_questions-linked_title_" + counter;
          $div = $("<div class=\"pure-u-1 pure-u-sm-1 pure-u-md-1 pure-u-lg-1\npure-u-xl-1\">");
          $linked_label = $("<label class=\"required\"\nfor=\"" + name + "\">Intitulé de la question associée</label>");
          $linked_title = $("<input class=\"pure-input-1\" name=\"" + name + "\" id=\"" + name + "\"\ndata-field=\"linked_title\" />");
          $div.append($linked_label, $linked_title);
          return $article.find('[data-field="answers"]').closest('div').after($div);
        } else {
          return (ref2 = $(e.target).closest('article').find('[data-field="linked_title"]')) != null ? ref2.parent('div').hide() : void 0;
        }
      }
    });
    this.$add_questions.on('click', (function(_this) {
      return function() {
        _this.$form_without_section.slideUp(800, function() {
          return _this.$section.slideDown();
        });
        $('html, body').animate({
          scrollTop: _this.$title.offset().top
        }, 700);
        _this.$hide_questions.toggleClass('hidden');
        _this.$more_question.toggleClass('hidden');
        return _this.$add_questions.toggleClass('hidden');
      };
    })(this));
    this.$more_question.on('click', (function(_this) {
      return function() {
        var $article, $target;
        _this.counter += 1;
        $article = $("<article class=\"consent-question\" data-counter=\"" + _this.counter + "\">");
        _this.$section.find('.original').each(function() {
          var $input_area, $label, $new_el, ref1;
          $new_el = $( this ).clone();
          $new_el.find('[data-field="answers"]:not(:first)').each(function() {
            return $( this ).remove();
          });
          if ((ref1 = $new_el.find('.remove-answer')) != null) {
            ref1.remove();
          }
          $new_el.removeClass('original');
          $label = $new_el.find('label');
          $input_area = $new_el.find('input, textarea');
          $label.each(function() {
            if ($( this ).attr('for') != null) {
              return $( this ).attr('for', ($( this ).attr('for')) + "_" + _this.counter);
            }
          });
          $input_area.each(function() {
            var attr;
            attr = "wtf_questions-" + ($( this ).attr('data-field'));
            $( this ).attr('id', ($( this ).attr('id')) + "_" + _this.counter);
            $( this ).attr('name', attr + "_" + _this.counter);
            if ($( this ).attr('type') === 'radio') {
              return $( this ).attr('checked', false);
            } else {
              return $( this ).val('');
            }
          });
          $new_el.attr('data-counter', _this.counter);
          return $article.append($new_el);
        });
        $article.append("<i class=\"fa fa-times remove-question\" data-counter=\"" + _this.counter + "\">");
        _this.$section.append($article);
        _this.$section.find('#wtf_questions-answers:last').parent('div').show();
        _this.$counter_field.val(_this.counter);
        $target = $("[name='wtf_questions-title_" + _this.counter + "']");
        return $('html, body').animate({
          scrollTop: $target.offset().top
        }, 700);
      };
    })(this));
    this.$consent.on('click', '.remove-question', function() {
      return $("article [data-counter=" + ($( this ).attr('data-counter')) + "]").remove();
    });
    this.$consent.on('click', '.add-question', function() {
      var $div, $new_input;
      $div = $( this ).parent('div');
      if ($div.find('input').length === 1) {
        $div.append('<i class="fa fa-minus remove-answer">');
      }
      $new_input = $div.find('input:last').clone();
      $new_input.val('');
      return $div.find('input:last').after($new_input);
    });
    this.$consent.on('click', '.remove-answer', function() {
      var $div;
      $div = $( this ).parent('div');
      $div.find('input:last').remove();
      if ($div.find('input').length === 1) {
        return $( this ).remove();
      }
    });
    this.$hide_questions.on('click', (function(_this) {
      return function() {
        _this.$section.slideUp(800, function() {
          return _this.$form_without_section.slideDown();
        });
        $('html, body').animate({
          scrollTop: _this.$title.offset().top
        }, 700);
        _this.$add_questions.toggleClass('hidden');
        _this.$more_question.toggleClass('hidden');
        return _this.$hide_questions.toggleClass('hidden');
      };
    })(this));
  }

  return Consent;

})(Base);

OnMatch.Newsletter = (function(superClass) {
  extend(Newsletter, superClass);

  Newsletter.prototype.match = ".newsletter-list";

  function Newsletter($list) {
    var $folders;
    this.$list = $list;
    Newsletter.__super__.constructor.apply(this, arguments);
    $folders = this.$list.find(".fa-3x");
    $folders.on('click', function() {
      var $content, $folder, $preview;
      $folder = $(this);
      $content = $folder.parents('article').find(".content");
      $preview = $folder.parents('article').find(".preview");
      if ($content.is(":visible")) {
        return $content.slideUp(function() {
          return $preview.slideDown();
        });
      } else {
        return $preview.slideUp(function() {
          return $content.slideDown();
        });
      }
    });
    this.$list.find('.delete').magnificPopup({
      type: 'ajax',
      callbacks: {
        ajaxContentAdded: (function(_this) {
          return function() {
            $('.mfp-content').children().addClass('white-popup mfp-with-anim');
            return $('.mfp-content form').on('submit', function(e) {
              var $form;
              e.preventDefault();
              $form = $(e.target);
              return $.post($form.attr('action')).done(function() {
                var $draft;
                $draft = _this.$list.find("[data-id=" + ($form.find('input[name="id"]').val()) + "]");
                $draft.slideUp(300, function() {
                  $(_this).remove();
                  if (_this.$list.find('article:visible').size() === 0) {
                    return _this.$list.append('<p>Aucun brouillon enregistré.</p>');
                  }
                });
                return $.magnificPopup.close();
              });
            });
          };
        })(this)
      }
    });
  }

  return Newsletter;

})(Base);

OnMatch.MailInput = (function(superClass) {
  extend(MailInput, superClass);

  MailInput.prototype.match = 'select[name="wtf_newsletter_content_type"]';

  function MailInput($newsletter_content_type) {
    this.$newsletter_content_type = $newsletter_content_type;
    this.newsletter_change = bind(this.newsletter_change, this);
    MailInput.__super__.constructor.apply(this, arguments);
    this.$newsletter_content_type.on('change', this.newsletter_change.bind(this));
    this.newsletter_change();
  }

  MailInput.prototype.newsletter_change = function() {
    var $choice;
    $choice = this.$newsletter_content_type.val();
    $('.mail_form').parent().hide();
    $('.mail_form.' + $choice).parent().show();
    if ($choice !== 'info') {
      $("#wtf_" + $choice + "_" + $choice + "_chosen").css({
        'width': '100%',
        'margin-bottom': '4em'
      });
      $(".chosen-drop").css("width", "100%");
      return $("#wtf_" + $choice + "_" + $choice + "_chosen input").css("width", "100%");
    } else {
      return $("label[for='wtf_content']").text('Contenu du message');
    }
  };

  return MailInput;

})(Base);

OnMatch.CanceledOrder = (function(superClass) {
  extend(CanceledOrder, superClass);

  CanceledOrder.prototype.match = ".canceled-button";

  function CanceledOrder($button1) {
    var popup;
    this.$button = $button1;
    CanceledOrder.__super__.constructor.apply(this, arguments);
    popup = "<div class=\"shopping-order-popup\">\n  <p>Le patient a déjÃ  payé sa commande.</p>\n  <form action=\"" + window.location.pathname + "\" method=\"post\">\n    <input type=\"hidden\" name=\"new_state\" value=\"CANCELED\"/>\n    <input type=\"hidden\" name=\"person_login\"\n    value=\"" + (this.$button.attr('data-person_login')) + "\"/>\n    <input type=\"submit\" class=\"button special-button\"\n    value=\"Annuler la commande et contacter le patient\" />\n  </form>\n  <form action=\"" + window.location.pathname + "\" method=\"post\">\n    <input type=\"hidden\" name=\"new_state\" value=\"CANCELED\"/>\n    <input type=\"submit\" class=\"button special-button\"\n    value=\"Annuler la commande et contacter le patient plus tard\" />\n  </form>\n</div>";
    this.$button.magnificPopup({
      items: {
        src: popup,
        type: 'inline'
      }
    });
  }

  return CanceledOrder;

})(Base);

OnMatch.ShippedOrder = (function(superClass) {
  extend(ShippedOrder, superClass);

  ShippedOrder.prototype.match = ".shipped-button";

  function ShippedOrder($button1) {
    var popup;
    this.$button = $button1;
    ShippedOrder.__super__.constructor.apply(this, arguments);
    popup = "<form action=\"" + window.location.pathname + "\" method=\"post\">\n  <input type=\"hidden\" name=\"new_state\" value=\"SHIPPED\"/>\n  <label for=\"carrier\">Mode de livraison</label>\n  <select name=\"carrier\" id=\"carrier\">\n    <option value=\"Aucun\">Aucun</option>\n    <option value=\"Colissimo\">Colissimo</option>\n    <option value=\"Lettre suivie\">Lettre suivie</option>\n  </select>\n  <label for=\"code\">Code du colis</label>\n  <input id=\"code\" name=\"code\" />\n  <input type=\"submit\" class=\"button special-button\" value=\"Expédiée\"/>\n</form>";
    this.$button.magnificPopup({
      items: {
        src: popup,
        type: 'inline'
      }
    });
  }

  return ShippedOrder;

})(Base);

OnMatch.PatientOrderUpdate = (function(superClass) {
  extend(PatientOrderUpdate, superClass);

  PatientOrderUpdate.prototype.match = '.patientorder-dashboard';

  function PatientOrderUpdate($dashboard) {
    this.$dashboard = $dashboard;
    this.update_table = bind(this.update_table, this);
    PatientOrderUpdate.__super__.constructor.apply(this, arguments);
    this.$dashboard.find('.patientorder-image').magnificPopup({
      type: 'image'
    });
    this.$dashboard.find('.patientorder-file-row').hide();
    $('#patientorder-tabs').tabs({
      beforeActivate: (function(_this) {
        return function(event, ui) {
          var $states, $tab;
          $states = ui.newPanel.attr('id').replace('tabs-', '');
          $tab = _this.$dashboard.find('#patientorder-tabs');
          $tab.attr('data-paginate', _this.$dashboard.find('.paginate-choice.chosen').text());
          $tab.attr('data-states', $states);
          return _this.update_table($tab.html5_data(), $states);
        };
      })(this)
    });
    this.$dashboard.on('click', '.patientorder-row', function(event) {
      var patientorder;
      patientorder = $(event.target).closest('tr').attr('class').split(' ')[0];
      return $("." + patientorder + ".patientorder-file-row").fadeToggle('fast').find('.document').each(function() {
        if ($(this).is('img')) {
          if ($(this).attr('src') === 'about:blank') {
            $(this).attr('src', $(this).attr('data-src'));
          } else {
            $(this).attr('src', 'about:blank');
          }
        }
        if ($(this).is('object')) {
          if (!$(this).attr('data')) {
            return $(this).attr('data', $(this).attr('data-data'));
          } else {
            return $(this).attr('data', '');
          }
        }
      });
    });
    this.$dashboard.on('change', '.patientorder-update', (function(_this) {
      return function(event) {
        var $select, $states;
        $states = $('.ui-state-active').attr('aria-controls').replace('tabs-', '');
        $select = $(event.target);
        $select.attr('data-paginate', _this.$dashboard.find('.paginate-choice.chosen').text());
        $select.attr('data-status_code', $select.find('option:selected').val());
        $select.attr('data-states', $states);
        $select.attr('data-start', _this.$dashboard.find('.patientorder-start').text());
        $select.attr('data-stop', _this.$dashboard.find('.patientorder-stop').text());
        return _this.update_table($select.html5_data(), $states);
      };
    })(this));
    this.$dashboard.on('click', '.paginate-choice:not(.chosen)', (function(_this) {
      return function(event) {
        var $pagination, $states;
        if ($('.ui-state-active').length > 0) {
          $states = $('.ui-state-active').attr('aria-controls').replace('tabs-', '');
        } else {
          $states = null;
        }
        $pagination = _this.$dashboard.find('.patientorder-pagination');
        $pagination.attr('data-paginate', $(event.target).text());
        $pagination.attr('data-states', $states);
        return _this.update_table($pagination.html5_data(), $states);
      };
    })(this));
    this.$dashboard.on('click', '.pointer', (function(_this) {
      return function(event) {
        var $navigation, $states;
        if ($('.ui-state-active').length > 0) {
          $states = $('.ui-state-active').attr('aria-controls').replace('tabs-', '');
        } else {
          $states = null;
        }
        $navigation = $(event.target).closest('p');
        if ($states != null) {
          $navigation.attr('data-states', $('.ui-state-active').attr('aria-controls').replace('tabs-', ''));
        }
        if ($(event.target).parent().hasClass('patientorder-prev')) {
          $navigation.attr('data-way', 'minus');
        } else {
          $navigation.attr('data-way', 'plus');
        }
        $navigation.attr('data-paginate', _this.$dashboard.find('.paginate-choice.chosen').text());
        $navigation.attr('data-states', $states);
        return _this.update_table($navigation.html5_data(), $states);
      };
    })(this));
  }

  PatientOrderUpdate.prototype.update_table = function($data, $states) {
    var $loading, $url;
    $loading = $('<span class="loading">Mise Ã  jour</span>');
    if ($states != null) {
      $url = window.location.pathname + $states;
      this.$dashboard.find("article#tabs-" + $states).append($loading);
    } else {
      $url = window.location.pathname;
      this.$dashboard.find(".patientorder-table").append($loading);
    }
    return $.post($url, $data).done((function(_this) {
      return function(response) {
        var $next, $prev, $table, j, len1, ref, status, total;
        $table = $states != null ? "#tabs-" + $states + " table" : "table";
        _this.$dashboard.find($table).html(response.table);
        _this.$dashboard.find('.patientorder-image').magnificPopup({
          type: 'image'
        });
        _this.$dashboard.find('.patientorder-file-row').hide();
        _this.$dashboard.find('.patientorder-start').html(response.start);
        _this.$dashboard.find('.patientorder-stop').html(response.stop);
        _this.$dashboard.find('.patientorder-navigation').attr('data-start', response.start);
        _this.$dashboard.find('.patientorder-navigation').attr('data-stop', response.stop);
        ref = ['PENDING-IN_PROGRESS', 'ACCEPTED', 'DELIVERED-CANCELED'];
        for (j = 0, len1 = ref.length; j < len1; j++) {
          status = ref[j];
          _this.$dashboard.find("." + status + "_title").html(response[status + '_title']);
        }
        $(".patientorder-total").html(response[$states]);
        $prev = _this.$dashboard.find('.patientorder-prev');
        $next = _this.$dashboard.find('.patientorder-next');
        total = response.is_patient ? response.total : response[$states];
        if (response.start - response.paginate > 0) {
          $prev.addClass('pointer');
        } else {
          $prev.removeClass('pointer');
        }
        if (response.stop < total) {
          $next.addClass('pointer');
        } else {
          $next.removeClass('pointer');
        }
        _this.$dashboard.find(".choice-" + response.paginate).addClass('chosen');
        _this.$dashboard.find(".paginate-choice:not(.choice-" + response.paginate + ")").removeClass('chosen');
        if (_this.$dashboard.find('.loading').length > 0) {
          return _this.$dashboard.find('.loading').remove();
        }
      };
    })(this));
  };

  return PatientOrderUpdate;

})(Base);

OnMatch.CartValidation = (function(superClass) {
  extend(CartValidation, superClass);

  CartValidation.prototype.match = '.cart-validation';

  function CartValidation($cart) {
    this.$cart = $cart;
    this.update_cart = bind(this.update_cart, this);
    this.plusminus_change = bind(this.plusminus_change, this);
    CartValidation.__super__.constructor.apply(this, arguments);
    this.$cart.find('.empty-button').magnificPopup({
      items: {
        src: $('#empty-div').html(),
        type: 'inline'
      },
      callbacks: {
        open: function() {
          $('.mfp-content').children().addClass('white-popup mfp-with-anim');
          $('.mfp-content').find('.cancel').on('click', function() {
            return $.magnificPopup.close();
          });
          return $('.mfp-content').find('.empty').on('click', function() {
            return window.location = $('.mfp-content').find('.empty').attr('data-url');
          });
        }
      }
    });
    this.$cart.on('plusminus_change', this.plusminus_change.bind(this));
    this.$promo_code = this.$cart.find('.promo-code');
    this.$button = $('.promo-code-button');
    this.$code = this.$promo_code.find('#wtf_promo_code');
    this.$button.on('click', this.apply_promo.bind(this));
    $('.promo-condition').tooltip({
      track: true
    });
    if (this.$promo_code.attr('data-already-promo') === "True") {
      this.$promo_code.find('.remove-promo').on('click', (function(_this) {
        return function() {
          return window.location.href = _this.$promo_code.attr('data-remove-url');
        };
      })(this));
    } else {
      this.$promo_code.find('.remove-promo').on('click', this.reset_price.bind(this));
    }
    this.no_promo = $('.cart-price-without-promo').hasClass('hidden');
    this.no_shipping = $('.shipping-price').hasClass('hidden');
    this.$cart.find('form').on('keydown', function(e) {
      if (e.keyCode === 13) {
        return e.preventDefault();
      }
    });
  }

  CartValidation.prototype.plusminus_change = function(oldval, val) {
    var input, j, len1, quantities, ref;
    this.$plusminus = this.$cart.find('.hydra-plus-minus');
    this.$plusminus.fadeTo(50, .25);
    quantities = {};
    ref = this.$plusminus.closest('form').find('input');
    for (j = 0, len1 = ref.length; j < len1; j++) {
      input = ref[j];
      quantities[$(input).attr('name')] = $(input).val();
    }
    return $.post(location.href, quantities).done((function(_this) {
      return function(response) {
        _this.$plusminus.fadeTo(250, 1);
        if (typeof response === 'string') {
          $(_this).val(oldval);
          return;
        }
        return _this.update_cart(response);
      };
    })(this));
  };

  CartValidation.prototype.update_cart = function(response) {
    var product_id, reopen, values;
    this.$promo_code.spin();
    for (product_id in response.elements) {
      values = response.elements[product_id];
      $("#cart_product_" + product_id).find('.cart_quantity input').val(values.quantity).end().find('.cart_price').html(values.price).end();
    }
    if (response.shipping_price != null) {
      $('dd.shipping-price').html(response.shipping_price_label);
      $('dd.cart-total-price').html(response.cart_total_price);
      $('.shipping-price, .cart-total-price').removeClass('hidden');
      $('.cart-price-without-shipping').addClass('hidden');
    } else {
      $('dd.cart-price-without-shipping').html(response.cart_price_without_shipping);
      $('dd.cart-price-without-shipping').attr('data-price', response.cart_price_without_shipping);
      $('.cart-price-without-shipping').removeClass('hidden');
      $('.shipping-price, .cart-total-price').addClass('hidden');
    }
    if (response.reduction_on_cart) {
      $('.cart-price-without-promo, .cart-promo-price').removeClass('hidden');
      $('dd.cart-price-without-promo').html(response.cart_price_without_promo);
      $('dd.cart-promo-price').html(response.cart_promo_price);
      $('dd.cart-promo-price').attr('data-price', response.cart_promo_price);
    } else {
      $('.cart-price-without-promo, .cart-promo-price').addClass('hidden');
    }
    this.$promo_code.spin(false);
    reopen = $('.widget-shopping_cart_widget').find('.details:visible').length;
    return $('.widget-shopping_cart_widget').trigger({
      type: 'refresh',
      callback: ((function(_this) {
        return function() {
          return reopen && _this.$cart.find('.details').show().end().find('.more').hide().end().find('.less').show();
        };
      })(this))
    });
  };

  CartValidation.prototype.apply_promo = function(e) {
    this.$promo_code.spin();
    this.$promo_code.find('.remove-promo,.promo-condition').addClass('hidden');
    return $.post(this.$button.attr('data-url') + 'add', {
      'wtf_promo_code': this.$code.val()
    }).done((function(_this) {
      return function(response) {
        var ref;
        if ((ref = _this.$promo_code.find('span.error')) != null) {
          ref.remove();
        }
        if (response.code_error) {
          $('.cancel-or-error').append("<span class=\"error\">" + response.code_error + "</span>");
          _this.$promo_code.spin(false);
          return;
        }
        $('.promo-condition').attr('title', response.condition);
        _this.$promo_code.find('.remove-promo,.promo-condition').removeClass('hidden');
        return _this.update_cart(response);
      };
    })(this));
  };

  CartValidation.prototype.reset_price = function(e) {
    this.$promo_code.spin();
    $('.remove-promo,.promo-condition').addClass('hidden');
    $.post(this.$button.attr('data-url') + 'remove').done((function(_this) {
      return function(response) {
        return _this.update_cart(response);
      };
    })(this));
    if ($(e.target).is('span')) {
      return $("#wtf_promo_code").val('');
    }
  };

  return CartValidation;

})(Base);

OnMatch.Overview = (function(superClass) {
  extend(Overview, superClass);

  Overview.prototype.match = '.overview';

  function Overview() {
    Overview.__super__.constructor.apply(this, arguments);
    $(".overview form").on('submit', function(event) {
      return event.preventDefault();
    });
    $("input.disabled").magnificPopup({
      disableOn: function() {
        if ($('#cgv_area input').is(':checked')) {
          return false;
        } else {
          return true;
        }
      },
      items: {
        src: $(".no_validate_popup").html(),
        type: 'inline'
      }
    });
    $('#cgv_area input').click(function() {
      if ($(this).is(':checked')) {
        $('.validate_if_read').removeClass('disabled');
        return $(".overview form").off('submit');
      } else {
        $('.validate_if_read').addClass('disabled');
        return $(".overview form").on('submit');
      }
    });
  }

  return Overview;

})(Base);

OnMatch.Recall = (function(superClass) {
  extend(Recall, superClass);

  Recall.prototype.match = '.recall-form';

  function Recall($recall) {
    var $button;
    this.$recall = $recall;
    this.$own_recalls = this.$recall.find('input[type=checkbox]');
    this.$own_recalls.on('change', this.disabled.bind(this));
    this.disabled();
    $button = $("<button class='button special-button another_add'> Valider puis ajouter un nouveau rappel</button>");
    this.$recall.find('#add_recall_button').after($button);
    $button.on('click', (function() {
      $('#wtf_another_add').val('True');
      return $('#add_recall_button').submit();
    }));
  }

  Recall.prototype.disabled = function() {
    var $own_recall, $prefix, j, len1, ref, results1;
    ref = this.$own_recalls;
    results1 = [];
    for (j = 0, len1 = ref.length; j < len1; j++) {
      $own_recall = ref[j];
      $prefix = $own_recall.parentElement.getAttribute('data-form');
      if ($own_recall.checked === true) {
        $("#" + $prefix + "firstname, #" + $prefix + "name").attr('disabled', 'disabled');
        results1.push($("#" + $prefix + "firstname, #" + $prefix + "name").val(''));
      } else {
        results1.push($("#" + $prefix + "firstname, #" + $prefix + "name").removeAttr('disabled'));
      }
    }
    return results1;
  };

  return Recall;

})(Base);

OnMatch.ShippingTypeAdmin = (function(superClass) {
  extend(ShippingTypeAdmin, superClass);

  ShippingTypeAdmin.prototype.match = '.shipping_type_choice';

  function ShippingTypeAdmin($shipping_type1) {
    var area, j, len1, price_id, price_selector, ref, ref1, ship_type;
    this.$shipping_type = $shipping_type1;
    ShippingTypeAdmin.__super__.constructor.apply(this, arguments);
    $("#shipping-tabs").tabs();
    this.$type_field = this.$shipping_type.find('.area-forms input:checkbox:not(.PICKUP_PAY)');
    this.type_change();
    this.$type_field.on('change', this.type_change.bind(this));
    ref = $('.PICKUP_PAY');
    for (j = 0, len1 = ref.length; j < len1; j++) {
      ship_type = ref[j];
      ref1 = $(ship_type).attr('class').split(' ').slice(0, 3), area = ref1[0], price_id = ref1[1];
      price_selector = area + '-' + price_id;
      $("#" + price_selector).parent().hide();
    }
  }

  ShippingTypeAdmin.prototype.type_change = function() {
    var area, j, len1, price_id, price_selector, ref, ref1, results1, ship_type, shipping_selector;
    ref = this.$type_field;
    results1 = [];
    for (j = 0, len1 = ref.length; j < len1; j++) {
      ship_type = ref[j];
      ref1 = $(ship_type).attr('class').split(' ').slice(0, 3), area = ref1[0], price_id = ref1[1];
      price_selector = area + '-' + price_id;
      shipping_selector = area + '-free_shipping_' + price_id.split('_')[1];
      $("#" + price_selector).parent().toggle(ship_type.checked);
      results1.push($("#" + shipping_selector).parent().toggle(ship_type.checked));
    }
    return results1;
  };

  return ShippingTypeAdmin;

})(Base);

OnMatch.PersonShortcut = (function(superClass) {
  extend(PersonShortcut, superClass);

  PersonShortcut.prototype.match = '.shortcut.link,.shortcut.unlink';

  function PersonShortcut($shortcut) {
    var args_input, button, form, input, label, link, page_input, submit;
    this.$shortcut = $shortcut;
    PersonShortcut.__super__.constructor.apply(this, arguments);
    link = this.$shortcut.is('.link');
    form = $('<form/>').prop('action', this.$shortcut.attr('href')).prop('method', 'POST').addClass('pure-form');
    label = $('<label/>');
    if (link) {
      label.prop('for', 'shortcut-label');
      label.html("Donnez un nom Ã  votre raccourci. Votre raccourci sera accessible depuis l'onglet 'Mon compte' : ");
      input = $('<input/>').prop('type', 'text').prop('id', 'shortcut-label').prop('name', 'shortcut-label').prop('placeholder', 'Mon raccourci');
      form.append(label, input);
    } else {
      label.html('ÃŠtes-vous sÃ»r de vouloir supprimer le raccourci associé Ã  cette page ? ');
      form.append(label);
    }
    page_input = $("<input/>").prop('type', 'hidden').prop('name', 'page').prop('value', this.$shortcut.attr('data-page'));
    args_input = $("<input/>").prop('type', 'hidden').prop('name', 'args').prop('value', this.$shortcut.attr('data-args'));
    submit = $('<input/>').prop('type', 'submit').addClass('special-button button').val('Valider');
    button = $('<button/>').prop('type', 'button').addClass('special-button button cancel').html('Annuler');
    form.append(page_input, args_input, submit, button);
    this.$shortcut.magnificPopup({
      items: {
        src: form,
        type: 'inline'
      },
      callbacks: {
        open: function() {
          var $form;
          $('.mfp-content').children().addClass('white-popup mfp-with-anim');
          $('.mfp-content').find('button.cancel').on('click', function() {
            $.magnificPopup.close();
            return false;
          });
          $form = $('.mfp-content form');
          return $form.on('submit', function() {
            return $form.find('input[type=submit]').prop('disabled', true).val('Chargementâ€¦');
          });
        }
      }
    });
  }

  return PersonShortcut;

})(Base);

OnMatch.Social = (function(superClass) {
  extend(Social, superClass);

  Social.prototype.match = '.social-toggle';

  function Social(toggle1) {
    this.toggle = toggle1;
    Socialite.setup({
      facebook: {
        lang: 'fr_FR'
      },
      twitter: {
        lang: 'fr'
      },
      googleplus: {
        lang: 'fr'
      },
      linkedin: {
        lang: 'fr_FR'
      }
    });
    this.toggle.on('click', (function(_this) {
      return function() {
        var $socialite;
        _this.toggle.off('click');
        $socialite = $('.social-buttons').removeClass('hidden');
        return Socialite.load($socialite.get(0));
      };
    })(this));
  }

  return Social;

})(Base);

OnMatch.SpecialityAdd = (function(superClass) {
  extend(SpecialityAdd, superClass);

  SpecialityAdd.prototype.match = ".speciality_add";

  function SpecialityAdd(match) {
    $('#wtf_speciality').change(function() {
      var val;
      val = $(this).val();
      if (val === '__None') {
        $("#wtf_content").val('');
        $("#wtf_title").val('');
      } else {
        $.ajax({
          url: "/speciality/json_detail/" + val,
          dataType: 'json',
          success: function(data) {
            tinymce.get($('.hydra-tiny-mce').attr('id')).setContent(data.content);
            $('#wtf_title').val(data.title);
          }
        });
      }
    });
  }

  return SpecialityAdd;

})(Base);

OnMatch.Theme = (function(superClass) {
  extend(Theme, superClass);

  Theme.prototype.match = '.edit_theme';

  function Theme($theme) {
    this.$theme = $theme;
    Theme.__super__.constructor.apply(this, arguments);
    this.$theme.find('.themes-list').on('click', 'a', function() {
      var $clicked, $current;
      $clicked = $(this);
      $current = $('article nav ul li:not(:has(a))');
      $('article nav').spin();
      return $.post($clicked.parent().attr('data-url')).done(function(response) {
        var $link;
        $('.screenshot').slideUp('fast', function() {
          $(this).html(response.screenshots);
          return $(this).slideDown('down');
        });
        $link = $('<a>').attr({
          'role': 'button',
          'class': 'pointer',
          'title': $current.attr('data-title')
        });
        $current.wrapInner($link);
        $clicked.contents().unwrap();
        return $('article nav').spin(false);
      });
    });
  }

  return Theme;

})(Base);


OnMatch.Platform = (function(superClass) {
  extend(Platform, superClass);

  Platform.prototype.match = '#widgets';

  function Platform() {
    setInterval((function() {
      var last_child, width;
      last_child = $('#widgets ul li:last-child').insertBefore($('#widgets ul li:first-child'));
      width = $(last_child).css('width');
      $(last_child).animate({
        "margin-right": "-" + width
      }, 0);
      return $(last_child).animate({
        "margin-right": 0
      }, 1000);
    }), 3000);
  }

  return Platform;

})(Base);

OnMatch.Offer = (function(superClass) {
  extend(Offer, superClass);

  Offer.prototype.match = '#theme';

  function Offer($theme) {
    this.$theme = $theme;
    Offer.__super__.constructor.apply(this, arguments);
    this.$theme.find(".screen-themes").slick({
      dots: false,
      arrows: false,
      vertical: true,
      verticalSwiping: true,
      asNavFor: '.mobile-themes',
      autoplay: true
    });
    this.$theme.find(".mobile-themes").slick({
      dots: false,
      arrows: false,
      vertical: true,
      verticalSwiping: true,
      asNavFor: '.screen-themes',
      autoplay: true
    });
  }

  return Offer;

})(Base);

chat = function(text, kind, type) {
  var $sb;
  if (kind == null) {
    kind = 'status';
  }
  if (type == null) {
    type = 'text';
  }
  $sb = $('.scrollback');
  $sb.append($('<div>', {
    "class": kind
  })[type](text));
  return $sb.stop(true, true).animate({
    scrollTop: $sb.prop('scrollHeight') - $sb.height()
  });
};

file_receiver = null;

files = [];

make_progress = function(text, max) {
  var $progress;
  $('.progresses').append($('<tr>').append($('<td>').text(text), $('<td>').append($progress = $('<progress>', {
    max: max
  }))));
  return $progress;
};
