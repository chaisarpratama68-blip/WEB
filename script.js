// JavaScript Code
document.addEventListener('DOMContentLoaded', function() {
    // Data contoh untuk aplikasi
    const sampleData = {
        duties: [
            { id: 1, day: 'Senin', group: 1, members: 'Chaisar, Hadi, Hanjang, Nirmala, Danila' },
            { id: 2, day: 'Selasa', group: 2, members: 'Tsabit, Haris, Adi, Aurel, Riska' },
            { id: 3, day: 'Rabu', group: 3, members: 'Messi, Aldi, Sahrul, Ridho, Amara' },
            { id: 4, day: 'Kamis', group: 4, members: 'JBilal, Dzaky, Adrian, Huda' },
            { id: 5, day: 'Jumat', group: 5, members: 'Bryan, Fidi, Devant, Dafian' }
        ],
        schedules: [
            { id: 1, day: 'Senin', time: '07:00 - 09:40', subject: 'Bahasa Inggris', teacher: 'Pak Waluyo' },
            { id: 2, day: 'Senin', time: '10:10 - 12:50', subject: 'Matematika', teacher: 'Bu Inda' },
            { id: 3, day: 'Senin', time: '13:20 - 14:40', subject: 'PPKN', teacher: 'Bu Wanda' },
        ],
        officers: [
            { id: 1, position: 'Ketua Kelas', name: 'Chaisar Pratama' },
            { id: 2, position: 'Wakil Ketua', name: 'Ahmad Hadi Nuril' },
            { id: 3, position: 'Sekretaris', name: 'Nimas Tirta Nirmala' },
            { id: 4, position: 'Bendahara', name: ' Rizka Amara Tungga Dewi' },
        ],
        cashflow: [
            { id: 1, date: '2025-11-01', description: 'Iuran bulanan', type: 'income', amount: 150000 },
            { id: 2, date: '2025-11-05', description: 'Beli alat kebersihan', type: 'expense', amount: 50000 },
            { id: 3, date: '2025-11-10', description: 'Dana kegiatan kelas', type: 'income', amount: 100000 },
            { id: 4, date: '2025-11-15', description: 'Snack rapat', type: 'expense', amount: 75000 }
        ],
        attendance: [
            { id: 1, name: 'Andi Pratama', present: 23, sick: 0, permission: 0, absent: 0 },
            { id: 2, name: 'Budi Santoso', present: 17, sick: 2, permission: 1, absent: 0 },
            { id: 3, name: 'Cici Amelia', present: 19, sick: 0, permission: 1, absent: 0 },
            { id: 4, name: 'Dedi Kurniawan', present: 16, sick: 1, permission: 2, absent: 1 },
            { id: 5, name: 'Eka Putri', present: 20, sick: 0, permission: 0, absent: 0 }
        ]
    };
    
    // Inisialisasi data dari localStorage atau gunakan data contoh
    let appData = JSON.parse(localStorage.getItem('classManagementData')) || sampleData;
    
    // Simpan data ke localStorage
    function saveData() {
        localStorage.setItem('classManagementData', JSON.stringify(appData));
    }
    
    // Fungsi untuk navigasi tab
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            // Hapus kelas active dari semua tab dan konten
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Tambah kelas active ke tab dan konten yang dipilih
            tab.classList.add('active');
            document.getElementById(tabId).classList.add('active');
            
            // Refresh data di tab yang aktif
            if (tabId === 'piket') {
                renderDutyTable();
            } else if (tabId === 'pelajaran') {
                renderScheduleTable();
            } else if (tabId === 'pengurus') {
                renderOfficerTable();
            } else if (tabId === 'kas') {
                renderCashflowTable();
                updateBalance();
            } else if (tabId === 'kehadiran') {
                renderAttendanceTable();
            } else if (tabId === 'dashboard') {
                renderTodaySchedule();
                updateBalancePreview();
            }
        });
    });
    
    // Modal functionality
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Render functions
    function renderTodaySchedule() {
        const todayScheduleTable = document.getElementById('today-duty');
        const today = new Date().getDay(); // 0 = Minggu, 1 = Senin, dst.
        const scheduleDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        
        // Cari jadwal pelajaran untuk hari ini
        const todaySchedules = appData.schedules.filter(schedule => schedule.day === scheduleDays[today]);
        
        todayScheduleTable.innerHTML = '';
        
        if (todaySchedules.length > 0) {
            todaySchedules.forEach((schedule, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${schedule.time}</td>
                    <td>${schedule.subject}</td>
                    <td>${schedule.teacher}</td>
                `;
                todayScheduleTable.appendChild(row);
            });
        } else {
            todayScheduleTable.innerHTML = '<tr><td colspan="4" style="text-align: center;">Tidak ada jadwal pelajaran hari ini</td></tr>';
        }
    }
    
    function renderDutyTable() {
        const dutyTable = document.getElementById('duty-table');
        dutyTable.innerHTML = '';
        
        appData.duties.forEach(duty => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${duty.day}</td>
                <td><span class="group-badge group-${duty.group}">Kelompok ${duty.group}</span></td>
                <td>${duty.members}</td>
                <td class="action-buttons">
                    <button class="btn btn-primary edit-duty" data-id="${duty.id}">Edit</button>
                    <button class="btn btn-danger delete-duty" data-id="${duty.id}">Hapus</button>
                </td>
            `;
            dutyTable.appendChild(row);
        });
        
        // Tambah event listener untuk tombol edit dan hapus
        document.querySelectorAll('.edit-duty').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                editDuty(id);
            });
        });
        
        document.querySelectorAll('.delete-duty').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                deleteDuty(id);
            });
        });
    }
    
    function renderScheduleTable() {
        const scheduleTable = document.getElementById('schedule-table');
        scheduleTable.innerHTML = '';
        
        appData.schedules.forEach(schedule => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${schedule.day}</td>
                <td>${schedule.time}</td>
                <td>${schedule.subject}</td>
                <td>${schedule.teacher}</td>
                <td class="action-buttons">
                    <button class="btn btn-primary edit-schedule" data-id="${schedule.id}">Edit</button>
                    <button class="btn btn-danger delete-schedule" data-id="${schedule.id}">Hapus</button>
                </td>
            `;
            scheduleTable.appendChild(row);
        });
        
        // Tambah event listener untuk tombol edit dan hapus
        document.querySelectorAll('.edit-schedule').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                editSchedule(id);
            });
        });
        
        document.querySelectorAll('.delete-schedule').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                deleteSchedule(id);
            });
        });
    }
    
    function renderOfficerTable() {
        const officerTable = document.getElementById('officer-table');
        officerTable.innerHTML = '';
        
        appData.officers.forEach(officer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${officer.position}</td>
                <td>${officer.name}</td>
                <td class="action-buttons">
                    <button class="btn btn-primary edit-officer" data-id="${officer.id}">Edit</button>
                    <button class="btn btn-danger delete-officer" data-id="${officer.id}">Hapus</button>
                </td>
            `;
            officerTable.appendChild(row);
        });
        
        // Tambah event listener untuk tombol edit dan hapus
        document.querySelectorAll('.edit-officer').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                editOfficer(id);
            });
        });
        
        document.querySelectorAll('.delete-officer').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                deleteOfficer(id);
            });
        });
    }
    
    function renderCashflowTable() {
        const cashflowTable = document.getElementById('cashflow-table');
        cashflowTable.innerHTML = '';
        
        appData.cashflow.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatDate(item.date)}</td>
                <td>${item.description}</td>
                <td>${item.type === 'income' ? '<span style="color: green;">Pemasukan</span>' : '<span style="color: red;">Pengeluaran</span>'}</td>
                <td>${formatCurrency(item.amount)}</td>
                <td class="action-buttons">
                    <button class="btn btn-danger delete-cashflow" data-id="${item.id}">Hapus</button>
                </td>
            `;
            cashflowTable.appendChild(row);
        });
        
        // Tambah event listener untuk tombol hapus
        document.querySelectorAll('.delete-cashflow').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                deleteCashflow(id);
            });
        });
    }
    
    function renderAttendanceTable() {
        const attendanceTable = document.getElementById('attendance-table');
        attendanceTable.innerHTML = '';
        
        appData.attendance.forEach(student => {
            const totalDays = student.present + student.sick + student.permission + student.absent;
            const percentage = totalDays > 0 ? Math.round((student.present / totalDays) * 100) : 0;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.present}</td>
                <td>${student.sick}</td>
                <td>${student.permission}</td>
                <td>${student.absent}</td>
                <td>${percentage}%</td>
            `;
            attendanceTable.appendChild(row);
        });
    }
    
    function updateBalance() {
        let balance = 0;
        
        appData.cashflow.forEach(item => {
            if (item.type === 'income') {
                balance += item.amount;
            } else {
                balance -= item.amount;
            }
        });
        
        document.getElementById('balance-amount').textContent = formatCurrency(balance);
    }
    
    function updateBalancePreview() {
        let balance = 0;
        
        appData.cashflow.forEach(item => {
            if (item.type === 'income') {
                balance += item.amount;
            } else {
                balance -= item.amount;
            }
        });
        
        document.getElementById('balance-preview').textContent = formatCurrency(balance);
    }
    
    // Format functions
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    }
    
    function formatCurrency(amount) {
        return 'Rp ' + amount.toLocaleString('id-ID');
    }
    
    // Modal forms
    function showDutyForm(duty = null) {
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        
        if (duty) {
            modalTitle.textContent = 'Edit Jadwal Piket';
        } else {
            modalTitle.textContent = 'Tambah Jadwal Piket';
        }
        
        modalBody.innerHTML = `
            <form id="duty-form">
                <div class="form-group">
                    <label for="duty-day">Hari:</label>
                    <select id="duty-day" required>
                        <option value="">Pilih Hari</option>
                        <option value="Senin" ${duty && duty.day === 'Senin' ? 'selected' : ''}>Senin</option>
                        <option value="Selasa" ${duty && duty.day === 'Selasa' ? 'selected' : ''}>Selasa</option>
                        <option value="Rabu" ${duty && duty.day === 'Rabu' ? 'selected' : ''}>Rabu</option>
                        <option value="Kamis" ${duty && duty.day === 'Kamis' ? 'selected' : ''}>Kamis</option>
                        <option value="Jumat" ${duty && duty.day === 'Jumat' ? 'selected' : ''}>Jumat</option>
                        <option value="Sabtu" ${duty && duty.day === 'Sabtu' ? 'selected' : ''}>Sabtu</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="duty-group">Kelompok:</label>
                    <select id="duty-group" required>
                        <option value="">Pilih Kelompok</option>
                        <option value="1" ${duty && duty.group === 1 ? 'selected' : ''}>Kelompok 1</option>
                        <option value="2" ${duty && duty.group === 2 ? 'selected' : ''}>Kelompok 2</option>
                        <option value="3" ${duty && duty.group === 3 ? 'selected' : ''}>Kelompok 3</option>
                        <option value="4" ${duty && duty.group === 4 ? 'selected' : ''}>Kelompok 4</option>
                        <option value="5" ${duty && duty.group === 5 ? 'selected' : ''}>Kelompok 5</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="duty-members">Anggota (pisahkan dengan koma):</label>
                    <input type="text" id="duty-members" value="${duty ? duty.members : ''}" required>
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
                    <button type="button" class="btn btn-danger" id="cancel-duty">Batal</button>
                    <button type="submit" class="btn btn-success">Simpan</button>
                </div>
            </form>
        `;
        
        modal.style.display = 'flex';
        
        document.getElementById('cancel-duty').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        document.getElementById('duty-form').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const day = document.getElementById('duty-day').value;
            const group = parseInt(document.getElementById('duty-group').value);
            const members = document.getElementById('duty-members').value;
            
            if (duty) {
                // Edit existing duty
                const index = appData.duties.findIndex(d => d.id === duty.id);
                if (index !== -1) {
                    appData.duties[index] = { ...duty, day, group, members };
                }
            } else {
                // Add new duty
                const newId = appData.duties.length > 0 ? Math.max(...appData.duties.map(d => d.id)) + 1 : 1;
                appData.duties.push({ id: newId, day, group, members });
            }
            
            saveData();
            renderDutyTable();
            modal.style.display = 'none';
        });
    }
    
    function showScheduleForm(schedule = null) {
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        
        if (schedule) {
            modalTitle.textContent = 'Edit Jadwal Pelajaran';
        } else {
            modalTitle.textContent = 'Tambah Jadwal Pelajaran';
        }
        
        modalBody.innerHTML = `
            <form id="schedule-form">
                <div class="form-group">
                    <label for="schedule-day">Hari:</label>
                    <select id="schedule-day" required>
                        <option value="">Pilih Hari</option>
                        <option value="Senin" ${schedule && schedule.day === 'Senin' ? 'selected' : ''}>Senin</option>
                        <option value="Selasa" ${schedule && schedule.day === 'Selasa' ? 'selected' : ''}>Selasa</option>
                        <option value="Rabu" ${schedule && schedule.day === 'Rabu' ? 'selected' : ''}>Rabu</option>
                        <option value="Kamis" ${schedule && schedule.day === 'Kamis' ? 'selected' : ''}>Kamis</option>
                        <option value="Jumat" ${schedule && schedule.day === 'Jumat' ? 'selected' : ''}>Jumat</option>
                        <option value="Sabtu" ${schedule && schedule.day === 'Sabtu' ? 'selected' : ''}>Sabtu</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="schedule-time">Jam Pelajaran:</label>
                    <input type="text" id="schedule-time" value="${schedule ? schedule.time : ''}" placeholder="Contoh: 07:00 - 08:30" required>
                </div>
                <div class="form-group">
                    <label for="schedule-subject">Mata Pelajaran:</label>
                    <input type="text" id="schedule-subject" value="${schedule ? schedule.subject : ''}" required>
                </div>
                <div class="form-group">
                    <label for="schedule-teacher">Guru Pengajar:</label>
                    <input type="text" id="schedule-teacher" value="${schedule ? schedule.teacher : ''}" required>
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
                    <button type="button" class="btn btn-danger" id="cancel-schedule">Batal</button>
                    <button type="submit" class="btn btn-success">Simpan</button>
                </div>
            </form>
        `;
        
        modal.style.display = 'flex';
        
        document.getElementById('cancel-schedule').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        document.getElementById('schedule-form').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const day = document.getElementById('schedule-day').value;
            const time = document.getElementById('schedule-time').value;
            const subject = document.getElementById('schedule-subject').value;
            const teacher = document.getElementById('schedule-teacher').value;
            
            if (schedule) {
                // Edit existing schedule
                const index = appData.schedules.findIndex(s => s.id === schedule.id);
                if (index !== -1) {
                    appData.schedules[index] = { ...schedule, day, time, subject, teacher };
                }
            } else {
                // Add new schedule
                const newId = appData.schedules.length > 0 ? Math.max(...appData.schedules.map(s => s.id)) + 1 : 1;
                appData.schedules.push({ id: newId, day, time, subject, teacher });
            }
            
            saveData();
            renderScheduleTable();
            renderTodaySchedule();
            modal.style.display = 'none';
        });
    }
    
    function showOfficerForm(officer = null) {
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        
        if (officer) {
            modalTitle.textContent = 'Edit Pengurus Kelas';
        } else {
            modalTitle.textContent = 'Tambah Pengurus Kelas';
        }
        
        modalBody.innerHTML = `
            <form id="officer-form">
                <div class="form-group">
                    <label for="officer-position">Jabatan:</label>
                    <input type="text" id="officer-position" value="${officer ? officer.position : ''}" required>
                </div>
                <div class="form-group">
                    <label for="officer-name">Nama Siswa:</label>
                    <input type="text" id="officer-name" value="${officer ? officer.name : ''}" required>
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
                    <button type="button" class="btn btn-danger" id="cancel-officer">Batal</button>
                    <button type="submit" class="btn btn-success">Simpan</button>
                </div>
            </form>
        `;
        
        modal.style.display = 'flex';
        
        document.getElementById('cancel-officer').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        document.getElementById('officer-form').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const position = document.getElementById('officer-position').value;
            const name = document.getElementById('officer-name').value;
            
            if (officer) {
                // Edit existing officer
                const index = appData.officers.findIndex(o => o.id === officer.id);
                if (index !== -1) {
                    appData.officers[index] = { ...officer, position, name };
                }
            } else {
                // Add new officer
                const newId = appData.officers.length > 0 ? Math.max(...appData.officers.map(o => o.id)) + 1 : 1;
                appData.officers.push({ id: newId, position, name });
            }
            
            saveData();
            renderOfficerTable();
            modal.style.display = 'none';
        });
    }
    
    function showCashflowForm(type) {
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        
        if (type === 'income') {
            modalTitle.textContent = 'Tambah Pemasukan';
        } else {
            modalTitle.textContent = 'Tambah Pengeluaran';
        }
        
        modalBody.innerHTML = `
            <form id="cashflow-form">
                <div class="form-group">
                    <label for="cashflow-date">Tanggal:</label>
                    <input type="date" id="cashflow-date" value="${new Date().toISOString().split('T')[0]}" required>
                </div>
                <div class="form-group">
                    <label for="cashflow-description">Keterangan:</label>
                    <input type="text" id="cashflow-description" required>
                </div>
                <div class="form-group">
                    <label for="cashflow-amount">Jumlah:</label>
                    <input type="number" id="cashflow-amount" required>
                </div>
                <input type="hidden" id="cashflow-type" value="${type}">
                <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
                    <button type="button" class="btn btn-danger" id="cancel-cashflow">Batal</button>
                    <button type="submit" class="btn btn-success">Simpan</button>
                </div>
            </form>
        `;
        
        modal.style.display = 'flex';
        
        document.getElementById('cancel-cashflow').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        document.getElementById('cashflow-form').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const date = document.getElementById('cashflow-date').value;
            const description = document.getElementById('cashflow-description').value;
            const amount = parseInt(document.getElementById('cashflow-amount').value);
            const type = document.getElementById('cashflow-type').value;
            
            // Add new cashflow
            const newId = appData.cashflow.length > 0 ? Math.max(...appData.cashflow.map(c => c.id)) + 1 : 1;
            appData.cashflow.push({ id: newId, date, description, type, amount });
            
            saveData();
            renderCashflowTable();
            updateBalance();
            updateBalancePreview();
            modal.style.display = 'none';
        });
    }
    
    function showAttendanceForm() {
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        
        modalTitle.textContent = 'Tambah Data Kehadiran';
        
        modalBody.innerHTML = `
            <form id="attendance-form">
                <div class="form-group">
                    <label for="attendance-name">Nama Siswa:</label>
                    <input type="text" id="attendance-name" required>
                </div>
                <div class="form-group">
                    <label for="attendance-present">Jumlah Hadir:</label>
                    <input type="number" id="attendance-present" value="0" min="0" required>
                </div>
                <div class="form-group">
                    <label for="attendance-sick">Jumlah Sakit:</label>
                    <input type="number" id="attendance-sick" value="0" min="0" required>
                </div>
                <div class="form-group">
                    <label for="attendance-permission">Jumlah Izin:</label>
                    <input type="number" id="attendance-permission" value="0" min="0" required>
                </div>
                <div class="form-group">
                    <label for="attendance-absent">Jumlah Alpha:</label>
                    <input type="number" id="attendance-absent" value="0" min="0" required>
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
                    <button type="button" class="btn btn-danger" id="cancel-attendance">Batal</button>
                    <button type="submit" class="btn btn-success">Simpan</button>
                </div>
            </form>
        `;
        
        modal.style.display = 'flex';
        
        document.getElementById('cancel-attendance').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        document.getElementById('attendance-form').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('attendance-name').value;
            const present = parseInt(document.getElementById('attendance-present').value);
            const sick = parseInt(document.getElementById('attendance-sick').value);
            const permission = parseInt(document.getElementById('attendance-permission').value);
            const absent = parseInt(document.getElementById('attendance-absent').value);
            
            // Add new attendance
            const newId = appData.attendance.length > 0 ? Math.max(...appData.attendance.map(a => a.id)) + 1 : 1;
            appData.attendance.push({ id: newId, name, present, sick, permission, absent });
            
            saveData();
            renderAttendanceTable();
            modal.style.display = 'none';
        });
    }
    
    // Edit and delete functions
    function editDuty(id) {
        const duty = appData.duties.find(d => d.id === id);
        if (duty) {
            showDutyForm(duty);
        }
    }
    
    function deleteDuty(id) {
        if (confirm('Apakah Anda yakin ingin menghapus jadwal piket ini?')) {
            appData.duties = appData.duties.filter(d => d.id !== id);
            saveData();
            renderDutyTable();
        }
    }
    
    function editSchedule(id) {
        const schedule = appData.schedules.find(s => s.id === id);
        if (schedule) {
            showScheduleForm(schedule);
        }
    }
    
    function deleteSchedule(id) {
        if (confirm('Apakah Anda yakin ingin menghapus jadwal pelajaran ini?')) {
            appData.schedules = appData.schedules.filter(s => s.id !== id);
            saveData();
            renderScheduleTable();
            renderTodaySchedule();
        }
    }
    
    function editOfficer(id) {
        const officer = appData.officers.find(o => o.id === id);
        if (officer) {
            showOfficerForm(officer);
        }
    }
    
    function deleteOfficer(id) {
        if (confirm('Apakah Anda yakin ingin menghapus pengurus kelas ini?')) {
            appData.officers = appData.officers.filter(o => o.id !== id);
            saveData();
            renderOfficerTable();
        }
    }
    
    function deleteCashflow(id) {
        if (confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
            appData.cashflow = appData.cashflow.filter(c => c.id !== id);
            saveData();
            renderCashflowTable();
            updateBalance();
            updateBalancePreview();
        }
    }
    
    // Event listeners for add buttons
    document.getElementById('add-duty-btn').addEventListener('click', () => {
        showDutyForm();
    });
    
    document.getElementById('add-schedule-btn').addEventListener('click', () => {
        showScheduleForm();
    });
    
    document.getElementById('add-officer-btn').addEventListener('click', () => {
        showOfficerForm();
    });
    
    document.getElementById('add-income-btn').addEventListener('click', () => {
        showCashflowForm('income');
    });
    
    document.getElementById('add-expense-btn').addEventListener('click', () => {
        showCashflowForm('expense');
    });
    
    document.getElementById('add-attendance-btn').addEventListener('click', () => {
        showAttendanceForm();
    });
    
    // Event listener for month filter
    document.getElementById('filter-month').addEventListener('change', (e) => {
        // In a real application, you would filter the data based on the selected month
        console.log('Filter bulan:', e.target.value);
    });
    
    // Initialize the application
    renderTodaySchedule();
    renderDutyTable();
    renderScheduleTable();
    renderOfficerTable();
    renderCashflowTable();
    renderAttendanceTable();
    updateBalance();
    updateBalancePreview();
});