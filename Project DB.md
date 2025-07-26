

### User

* User Id (PK) (Auto-Increment)
* Name (Not Null) 
* Password (Not Null) \[Regular Expression]
* Email (Not Null) (format)
* Flat No (Not Null) (int)
* Mobile No (Not Null) (int) (10)
* Roles (Not Null)
* temp\_x1 (Null)





### Notices

* Notice Id (PK)(Auto Increment)
* Notice Text(Not Null)
* Sender Name(Not Null)
* Sender Email(Not Null)



### Feedback

* Feedback id(PK)
* Feedback text
* Feedback date-time (DATETIME)
* sender name





### Bills (Accountant)

* Bill id/No(PK)
* Bill text
* Bill Amt
* Flat No
* Sender
* penalties (NULL)



### Bookings

* Booking id
* booking date-time
* booking reason
* booking period
* booking amt
* booking status (ENUM --(PENDING, SUCCESS))





### Payments

* payment id
* payment description
* amt
* flat no
* user id (FK) from user
* bill id (FK) from bills
* payment status (ENUM --(PENDING, SUCCESS, FAILED))
* payment date





### Complaints

* complaint id
* complaint category
* description
* sender name
* sender email
* flat no
* complaint status  (ENUM --(REJECTED, ACCEPTED, IN PROGRESS))
* Admin Answer





### Admin

* admin id(Pk)
* complaint id(FK)
* Booking id(FK)
* Payment id(FK)
* Notice id(FK)











Title : HomeHive



Features:

=====(Key-Functions)====

Authentication and Authorization (Role-Based Access Control)

Payment System Integration (Razor, Stripe)

Email Notification System

Notices \& Events are visible to all users on dashboard or via notification/email.

Society facilities Booking System with Real-Time Availability Checks





==== User ====

Register/Login to the system.

Residents pay via integrated payment gateway. Status updates to Paid with receipt generation.

View payment history

View dues, make online payments, access notices, and submit feedback.

Resident raises a complaint (plumbing, electricity, etc.).

Allow users to book society facilities like the clubhouse, multipurpose hall, etc.





==== Accountant ====

Register/Login to the system.

Account will generates bills per flat. view bills in their dashboard. Notification is sent via email to User.

Export to PDF/Excel.

Apply Penalties on Late Payment.





==== Admin ====

Secure Admin Login

View All Complaint history

Post updates, organize events, and share important announcements in real-time.

View All Users

Grant Special Roles (e.g., Role\_Account)

Monitor platform activities

Notices \& Events are visible to all users on dashboard or via notification/email.





