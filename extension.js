const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const Shell = imports.gi.Shell;

let text, button;

function _hideHello() {
    Main.uiGroup.remove_actor(text);
    text = null;
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
            }
        }

    }
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
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(button, 0);
}

function disable() {
    Main.panel._rightBox.remove_child(button);
}
