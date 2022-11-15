use erased_serde::Serialize as ErasedSerialize;

pub trait Attack {
    fn get_logs(&self) -> Vec<Box<dyn ErasedSerialize>>;
    fn start(&mut self) -> ();
    fn stop(&mut self) -> ();
}
