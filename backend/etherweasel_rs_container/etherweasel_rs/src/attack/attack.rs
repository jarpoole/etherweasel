use erased_serde::Serialize as ErasedSerialize;

pub trait Attack {
    fn get_logs(&self) -> Vec<Box<dyn ErasedSerialize>>;
    //fn stop() -> ();
    //fn start(concurrency: u16) -> ();
}
