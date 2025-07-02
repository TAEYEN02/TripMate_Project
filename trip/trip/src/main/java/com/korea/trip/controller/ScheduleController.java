
    }

    @PostMapping("/auto-generate")
    public ResponseEntity<?> autoGenerate(@RequestBody ScheduleCreateRequest request) {

            return ResponseEntity.ok(schedule);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("서버 오류 발생: " + e.getMessage());
        }
