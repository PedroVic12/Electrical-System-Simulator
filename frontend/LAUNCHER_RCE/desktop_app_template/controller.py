from PySide6.QtCore import QObject, QThread, QFileSystemWatcher

class SimulationController(QObject):
    def __init__(self, model, view):
        super().__init__()
        self._model = model
        self._view = view
        self._thread = None

        self._view.start_simulation_requested.connect(self.start_simulation)
        self._model.progress_updated.connect(self._view.update_log)
        self._model.simulation_finished.connect(self.on_simulation_finish)

        self.file_watcher = QFileSystemWatcher()
        self.file_watcher.addPath(self._model.results_folder)
        self.file_watcher.directoryChanged.connect(
            lambda: self._view.update_results_list(self._model.results_folder)
        )
        self._view.update_results_list(self._model.results_folder)

    def start_simulation(self):
        self._view.set_simulation_running(True)
        self._thread = QThread()
        self._model.moveToThread(self._thread)
        self._thread.started.connect(self._model.run_simulation_process)
        self._thread.start()

    def on_simulation_finish(self, return_code):
        if self._thread is not None:
            self._thread.quit()
            self._thread.wait()
            self._thread = None
        self._view.set_simulation_running(False)
        self._view.update_log(f"--- Fim da Simulação (Código: {return_code}) ---")
        self._view.update_results_list(self._model.results_folder)