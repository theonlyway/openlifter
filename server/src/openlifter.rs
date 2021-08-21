//! Rust definitions for OpenLifter datatypes.

// TODO(sstangl): Replace (most) uses of f64 with the OpenPowerlifting WeightKg.
// TODO(sstangl): Do we want deny_unknown_fields?
// TODO(sstangl): Note that we don't have to validate due to templating.

// TODO(sstangl): Commentary.
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VersionsState {
    state_version: String,
    release_version: String,
}

/// Information for a particular lifter.
///
/// # Data types
/// Care is taken to be as loose as possible with the parsing, to allow custom versions to use
/// their own renamed categories. For example, rather than making a hardcoded Equipment type on
/// the server, we accept whatever equipment name is provided in the client JSON. Translations
/// are therefore best-effort.
///
/// TODO(sstangl): You'd better audit this!
/// TODO(sstangl): More commentary once this is set up.
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Entry {
    id: u32,
    day: u32,
    platform: u32,
    flight: String,
    name: String,
    sex: String, // TODO: This one could probably be an enum and validated.
    birth_date: String,
    age: u32,
    country: String,
    state: String,
    intended_weight_class_kg: String,
    equipment: String,
    divisions: Vec<String>, // TODO: Vec<Event>
    events: Vec<String>,    // TODO: Vec<Event>
    lot: u32,
    member_id: String,
    paid: bool,
    team: String,
    guest: bool,
    instagram: Option<String>,
    notes: String,
    bodyweight_kg: f64,
    squat_rack_info: String,
    bench_rack_info: String,
    squat_kg: Vec<f64>,
    bench_kg: Vec<f64>,
    deadlift_kg: Vec<f64>,
    squat_status: Vec<u32>,    // TODO: Vec<LiftStatus>
    bench_status: Vec<u32>,    // TODO: Vec<LiftStatus>
    deadlift_status: Vec<u32>, // TODO: Vec<LiftStatus>
}

// TODO(sstangl): Commentary.
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Plate {
    weight_kg: f64,
    pair_count: u32,
    color: String,
}

// TODO(sstangl): Commentary.
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MeetState {
    // Sanction information.
    name: String,
    country: String,
    state: String,
    city: String,
    federation: String,
    date: String,
    length_days: u32,
    platforms_on_days: Vec<u32>,
    age_coefficients: String,

    // Competition rules.
    divisions: Vec<String>,
    weight_classes_kg_men: Vec<f64>,
    weight_classes_kg_women: Vec<f64>,
    weight_classes_kg_mx: Vec<f64>,
    formula: String,
    combine_sleeves_and_wraps: bool,
    combine_single_and_multi: bool,
    allow_4th_attempts: bool,

    // Weights and loading setup.
    in_kg: bool,
    squat_bar_and_collars_weight_kg: f64,
    bench_bar_and_collars_weight_kg: f64,
    deadlift_bar_and_collars_weight_kg: f64,
    plates: Vec<Plate>,
    show_alternate_units: bool,
}

// TODO(sstangl): Commentary.
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RegistrationState {
    next_entry_id: u32,
    entries: Vec<Entry>,
    // lookup: (), // TODO(sstangl): HashMap<String(id), index in entries vec>. Do we need this?
}

// TODO(sstangl): Commentary.
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LiftingState {
    day: u32,
    platform: u32,
    flight: String,
    lift: String,
    override_attempt: Option<u32>,
    override_entry_id: Option<u32>,
    column_division_width_px: f64,
}

// TODO(sstangl): Commentary.
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GlobalState {
    versions: VersionsState,
    language: String,
    meet: MeetState,
    registration: RegistrationState,
    lifting: LiftingState,
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Tests deserialization of a sample meet with two lifters.
    #[test]
    fn deserialization_sanity() {
        let payload = include_str!("sample.openlifter");
        serde_json::from_str::<GlobalState>(payload).unwrap();
    }
}
