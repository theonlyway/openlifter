//! Rust definitions for OpenLifter datatypes.

use opltypes::WeightKg;

// TODO(sstangl): Do we want deny_unknown_fields?
// TODO(sstangl): Note that we don't have to validate due to templating.

// TODO(sstangl): Commentary.
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VersionsState {
    pub state_version: String,
    pub release_version: String,
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
    pub id: u32,
    pub day: u32,
    pub platform: u32,
    pub flight: String,
    pub name: String,
    pub sex: String, // TODO: This one could probably be an enum and validated.
    pub birth_date: String,
    pub age: u32,
    pub country: String,
    pub state: String,
    pub intended_weight_class_kg: String,
    pub equipment: String,
    pub divisions: Vec<String>, // TODO: Vec<Event>
    pub events: Vec<String>,    // TODO: Vec<Event>
    pub lot: u32,
    pub member_id: String,
    pub paid: bool,
    pub team: String,
    pub guest: bool,
    pub instagram: Option<String>,
    pub notes: String,
    pub bodyweight_kg: WeightKg,
    pub squat_rack_info: String,
    pub bench_rack_info: String,
    pub squat_kg: Vec<WeightKg>,
    pub bench_kg: Vec<WeightKg>,
    pub deadlift_kg: Vec<WeightKg>,
    pub squat_status: Vec<u32>,    // TODO: Vec<LiftStatus>
    pub bench_status: Vec<u32>,    // TODO: Vec<LiftStatus>
    pub deadlift_status: Vec<u32>, // TODO: Vec<LiftStatus>
}

// TODO(sstangl): Commentary.
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Plate {
    pub weight_kg: WeightKg,
    pub pair_count: u32,
    pub color: String,
}

// TODO(sstangl): Commentary.
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MeetState {
    // Sanction information.
    pub name: String,
    pub country: String,
    pub state: String,
    pub city: String,
    pub federation: String,
    pub date: String,
    pub length_days: u32,
    pub platforms_on_days: Vec<u32>,
    pub age_coefficients: String,

    // Competition rules.
    pub divisions: Vec<String>,
    pub weight_classes_kg_men: Vec<WeightKg>,
    pub weight_classes_kg_women: Vec<WeightKg>,
    pub weight_classes_kg_mx: Vec<WeightKg>,
    pub formula: String,
    pub combine_sleeves_and_wraps: bool,
    pub combine_single_and_multi: bool,
    pub allow_4th_attempts: bool,

    // Weights and loading setup.
    pub in_kg: bool,
    pub squat_bar_and_collars_weight_kg: WeightKg,
    pub bench_bar_and_collars_weight_kg: WeightKg,
    pub deadlift_bar_and_collars_weight_kg: WeightKg,
    pub plates: Vec<Plate>,
    pub show_alternate_units: bool,
}

// TODO(sstangl): Commentary.
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RegistrationState {
    pub next_entry_id: u32,
    pub entries: Vec<Entry>,
    // pub lookup: (), // TODO(sstangl): HashMap<String(id), index in entries vec>. Do we need this?
}

// TODO(sstangl): Commentary.
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LiftingState {
    pub day: u32,
    pub platform: u32,
    pub flight: String,
    pub lift: String,
    pub override_attempt: Option<u32>,
    pub override_entry_id: Option<u32>,
    pub column_division_width_px: f64,
}

// TODO(sstangl): Commentary.
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GlobalState {
    pub versions: VersionsState,
    pub language: String,
    pub meet: MeetState,
    pub registration: RegistrationState,
    pub lifting: LiftingState,
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
