const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const Shell = imports.gi.Shell;
const WindowManager = imports.ui.windowManager;

let text, button;
let myGlobalWindow;
let _completedDestroy = null;
let connectHandle = null;


function _hideHello() {
    Main.uiGroup.remove_actor(text);
    text = null;
}

function keepOpen() {
    log("Keeping this open!!!");
    return true;
}

function _showHello() {
    if (!text) {
        text = new St.Label({style_class: 'helloworld-label', text: "Let me try to focus spotify..."});
        Main.uiGroup.add_actor(text);
    }

    text.opacity = 255;

    let monitor = Main.layoutManager.primaryMonitor;

    text.set_position(monitor.x + Math.floor(monitor.width / 2 - text.width / 2),
        monitor.y + Math.floor(monitor.height / 2 - text.height / 2));

    Tweener.addTween(text,
        {
            opacity: 0,
            time: 2,
            transition: 'easeOutQuad',
            onComplete: _hideHello
        });


    let apps = Shell.AppSystem.get_default().get_running();

    for (let i = 0; i < apps.length; i++) {
        let app = apps[i];
        let windows = app.get_windows();

        for (let j = 0; j < windows.length; j++) {
            let window = windows[j];


            if (app.get_name() === 'Spotify') {
                Main.activateWindow(window);

                let title = app.get_name() + ' - ' + window.get_title();
                log(title);
                if(connectHandle) {
                    window.disconnect(connectHandle);
                }
                connectHandle = window.connect('delete-event', keepOpen);
            }
        }

    }

    if(myGlobalWindow) {
        Main.activateWindow(myGlobalWindow, undefined, 0);
    }

    /* log("WindowManager:", WindowManager.WindowManager);
    log("WindowManager.prototype:", WindowManager.WindowManager.prototype);
    log("WindowManager.prototype._minimizeWindow:", WindowManager.WindowManager.prototype._minimizeWindow);*/

    //log(Object.keys(global.window_manager));
}

function init() {
    button = new St.Bin({ style_class: 'panel-button',
                          reactive: true,
                          can_focus: true,
                          x_fill: true,
                          y_fill: false,
                          track_hover: true });
    let icon = new St.Icon({ icon_name: 'system-run-symbolic',
                             style_class: 'system-status-icon' });

    button.set_child(icon);
    button.connect('button-press-event', _showHello);

    global.window_manager.connect('destroy', myDestroy);
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(button, 0);

    /*if(!_completedDestroy){
        _completedDestroy = global.window_manager.completed_destroy.bind(global.window_manager);
        global.window_manager.completed_destroy = function(actor){
            log("So beatiful");
            //_completedDestroy(actor);
            myGlobalWindow = actor.meta_window;
        }
    }*/
}

function disable() {
    Main.panel._rightBox.remove_child(button);
}

function myDestroy(shellwm, actor) {
    log('Destroying window.');
    log(actor.meta_window.get_gtk_window_object_path());
    //myGlobalWindow = actor.meta_window;
    //log(myGlobalWindow.get_workspace().index());
}

/*WindowManager.WindowManager.prototype._minimizeWindow = function (shellwm, actor) {
    log('GOT HERE.');
};*/